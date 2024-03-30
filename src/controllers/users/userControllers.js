import User from "../../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegistration = async (req, res) => {
  const saltRounds = 10;
  const { name, email, password, confpassword } = req.body;

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
          return res.status(400).json({ message: "Error hashing password" + err});
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
          res.status(200).json({ message: "Registration succss" ,userdata});
        } catch (error) {
          console.log(error);
          res.status(400).json({ message: "Error During user registration",error });
        }
      });
    } else {
      res.json({ message: "Required field is Mandatory" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Registration failed!",error });
  }
};


//-------------------get all user-------------------------------------------------
export const getAllUsers=async(req,res)=>{
try {
  const allUsers=await User.find()
  if(allUsers){
   res.json(allUsers);
  }
  
} catch (error) {
 return res.status(400).json({ message: "Fetching data failed!",error });
}
}

// -----------------update user profile--------------------------------------------


export const updateUserProfile=async(req,res)=>{
  
const {name,gender,mobile,profilepic,address,socialMedia}=req.body
  
  try {
    // Find the user by ID and update the profile
    const user=await User.findById(req.params.id);
     if(!user){
      res.json({message:"User Not Found"})
     }else{
          // Update user profile with data from request body
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (mobile) user.mobile = mobile;
    if (profilepic) user.profilepic = profilepic;
    if (address) user.address = address;
    if (socialMedia) user.socialMedia = socialMedia;

    // Save the updated user profile
    const updatedUser = await user.save();

    res.status(200).json(updatedUser)
     }
   

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error updating user profile" });
  }
}





// --------------------------user login--------------------------------------------

export const userLogin=async(req,res)=>{


  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return res.status(400).json({ message: "User Not Found" });
    }
    if(!password){
      return res.status(400).json({ message: "Enter the Password" });
    }
    
    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, validUser.password, (err, result) => {
      if (err) {
        // Handle bcrypt compare error
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Internal Server Error" });
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
}


