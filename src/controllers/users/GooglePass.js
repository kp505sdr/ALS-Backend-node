import User from "../../models/userModels.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const PassGoogleSuccess=async(req,res,next)=>{
    const saltRounds=10;
    const userData = req?.user?._json; 
    console.log(req)
     console.log(res)
    // isAuthenticated function provide by passport
    if (req.isAuthenticated()) {
        // Here you can perform database operations, handle user creation, or return the user profile
        try {
          // Check if user already exists in database
          let user = await User.findOne({ email: userData.email });
       
          if (!user) {
              // If user doesn't exist, create a new user
              const hashPass = await bcrypt.hash(userData.sub, saltRounds);
              const newUser = new User({
                name: userData.name,
                email: userData.email,
                profilepic: userData.picture,
                email_verified:userData.email_verified,
                password: hashPass,
                
              });
              user = await newUser.save();
             
          }
          user.password=undefined

            // Generate JWT token
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
         
          return res.status(200).json({message:"Login success",token,user});
           
        } catch (err) {
          return res.status(400).json({message:"Internal server error"+err});
        }
      
    }
    else{
       
            // If the user is not authenticated, redirect them to login
            return res.status(400).json({message:"User not Authenticated"});
        
    }


}













export const PassGoogleFailure=async(req,res)=>{
    console.log(res)

}