import User from "../../models/userModels.js";
import bcrypt from "bcrypt";
import { check } from "express-validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { EmailConfig } from "../../models/emailConfigModels.js";
export const userRegistration = async (req, res) => {
  const saltRounds = 10;
  const { name, email, password, confpassword } = req.body;

  // ------------send mail to verify----start------------
  const sendVerifyMail = async (name, email, id) => {
    //temp token for email verification
    const emailConfigs = await EmailConfig.find();
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });
    try {
      const transporter = nodemailer.createTransport({
        host: emailConfigs[0].hostName, //'smtp.gmail.com'
        port: emailConfigs[0].portNumber, // 587
        secure: true,
        requireTLS: true,
        // pass=fkqy tacy tith clcu
        service: emailConfigs[0].serviceName, //gmail
        auth: {
          user: emailConfigs[0].serviceEmail, // "kctech4you@gmail.com"
          pass: emailConfigs[0].emailPassword, // "fkqytacytithclcu"
        },
      });
      const mailOptions = {
        from: emailConfigs[0].serviceEmail, //"kctech4you@gmail.com"
        to: email,
        subject: "Verification Mail For Active Your Account!",
        html: `<p>Hi ${name}, Please click on the given link to <a href="http://localhost:3000/verify/${id}/${token}">Verify</a> your Account.</p>`,
        // '<p>Hi" ' +
        // name +
        // '  ",Please click on given link to <a href="http://localhost:3000/verify/' +
        // id +'/'+ token +
        // '"> Verify </a> your mail.</p>',
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("email has been sent:-", info.response);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // ------------send mail to verify- end---------------

  try {
    if (name && email && password && confpassword) {
      if (password !== confpassword) {
        return res.json({ message: "Password and confirm password not match" });
      }
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.json({ message: "Email Already Exist Try any other email" });
      }

      // Hash the password
      bcrypt.hash(password, saltRounds, async (err, hashPass) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Error hashing password" + err });
        }

        // Create a new user object
        const userdata = new User({
          name,
          email,
          password: hashPass,
        });

        try {
          // Save the user to the database
          userdata.save();
          sendVerifyMail(name, email, userdata._id); //nodemailer fun call

          res.status(200).json({ message: "Registration succss", userdata });
        } catch (error) {
          console.log(error);
          res
            .status(400)
            .json({ message: "Error During user registration", error });
        }
      });
    } else {
      res.json({ message: "Required field is Mandatory" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Registration failed!", error });
  }
};
// ------------------verify mail-- start---------

export const verifyemail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.params.id },
      { $set: { email_verified: true, tempToken: "" } }
    );

    return res
      .status(200)
      .json({ message: "Email verified successfully", updateInfo });
  } catch (error) {
    console.error(error.message);

    return res
      .status(500)
      .json({ message: "Email verification failed OR Internal server error" });
  }
};
// ------------------verify mail-- end---------

//-------------------send email for forget password ---------start-----------
export const ForgetPassword = async (req, res) => {

  try {
    // Assuming you receive the user's email address in the request body
    const { email } = req.body;
  

    // Check if the email exists in the database
    const user = await User.findOne({ email:email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token
    const emailConfigs = await EmailConfig.find();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set the token expiration time, e.g., 1 hour
    });

    // Send the password reset link to the user's email address
    const transporter = nodemailer.createTransport({
      // Configure nodemailer transporter (e.g., SMTP, SendGrid, etc.)
      // Example configuration for Gmail SMTP:
      host: emailConfigs[0].hostName, //'smtp.gmail.com'
      port: emailConfigs[0].portNumber, // 587
      secure: true,
      requireTLS: true,
      // pass=fkqy tacy tith clcu
      service: emailConfigs[0].serviceName, //gmail
      auth: {
        user: emailConfigs[0].serviceEmail, // "kctech4you@gmail.com"
        pass: emailConfigs[0].emailPassword, // "fkqytacytithclcu"
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Password Reset",
      html: `<p>Hi ${user.name},</p>
             <p>Please click <a href="${process.env.BASE_URL}/resetpassword/${token}">here</a> to reset your password.</p>
             <p>If you didn't request this, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send reset password email" });
      }
      console.log('Reset password email sent:', info.response);
      res.status(200).json({ message: 'password Reset email sent successfully' });
    });
  } catch (error) {
    console.error("ForgetPassword error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//------------------send email for---forget ----pass ---end

// ---------------reset----passwor---- and save-----start--------------------
export const ResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token contains the userId
    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Find the user by userId
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Optionally, you can expire the token after password reset
    // You may want to implement a mechanism to delete the token from the database

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("ResetPassword error:", error.message);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
//reste--pass--and --save ---end-------------------------

//-------------------get all user-------------------------------------------------
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers) {
      res.json(allUsers);
    }
  } catch (error) {
    return res.status(400).json({ message: "Fetching data failed!", error });
  }
};

// ---------------------------all--user ---end--------------------------------------

//--------------------------get-single---user--start-----------------------
export const getSingleUser=async(req,res)=>{
  const userId = req.authData.userId;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

//---------------------------get-single-user--end----------------------


//-----------cahnge password---start--------------------------
export const ChangePassword = async (req, res) => {
  const saltRounds = 10;
  try {
    const { oldPassword, newPassword } = req.body;

    
    const userId = req.authData.userId;
    // Find the user by ID and update Password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (!newPassword || !oldPassword) {
      return res
        .status(400)
        .json({ message: "Enter the Old and New Password" });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (passwordMatch) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password
      user.password = hashedPassword;
      // Save the user
      await user.save();
      // Respond with success message
      return res.send("Password changed successfully");
    } else {
      return res.status(401).send("Incorrect old password");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).send("Server Error");
  }
};
//-----------cahnge password---end--------------------------

// -----------------update user profile--------------------------------------------

export const updateUserProfile = async (req, res) => {
  const { name, gender, mobile, profilepic, address, socialMedia } = req.body;

  try {
    const userId = req.authData.userId;
    // Find the user by ID and update the profile
    const user = await User.findById(userId);
    if (!user) {
      res.json({ message: "User Not Found" });
    } else {
      // Update user profile with data from request body
      if (name) user.name = name;
      if (gender) user.gender = gender;
      if (mobile) user.mobile = mobile;
      if (profilepic) user.profilepic = profilepic;
      if (address) user.address = address;
      if (socialMedia) user.socialMedia = socialMedia;

      // Save the updated user profile
      const updatedUser = await user.save();

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error updating user profile" });
  }
};

// --------------------------user login--------------------------------------------

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return res.status(400).json({ message: "User Not Found" });
    }
    if (!password) {
      return res.status(400).json({ message: "Enter the Password" });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, validUser.password, (err, result) => {
      if (err) {
        // Handle bcrypt compare error
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!validUser.email_verified) {
        return res.status(400).json({
          message: " first you need to verify your email, link has been sent..",
        });
      }
      if (result) {
        // Passwords match, generate JWT token
        const token = jwt.sign(
          { userId: validUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "10d" }
        );
        // Omit the password from the user object before sending it to the client
        const { password, ...userWithoutPassword } = validUser.toObject();
        // Send success response with user details and token
        res.status(200).json({
          status: "success",
          message: "Login success!",
          user: userWithoutPassword,
          token: token,
        });
      } else {
        // Passwords do not match
        res.status(400).json({ message: "Email or Password Not Match" });
      }
    });
  } catch (error) {
    // Handle other errors
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ----------------delete user by admin--------------------------

export const deleteUser = async (req, res) => {
  try {
    const findUser = await User.findById(req.params.id);
    if (findUser) {
      await User.findByIdAndDelete(req.params.id); // Delete the user
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
