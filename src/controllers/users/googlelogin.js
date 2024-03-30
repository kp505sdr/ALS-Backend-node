import { OAuth2Client } from 'google-auth-library';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../../models/userModels.js";
// Initialize OAuth2Client with your Google client ID
const client = new OAuth2Client('422908320610-o916m3gohtij3844gilde1fo1tp49719.apps.googleusercontent.com'); // The client ID you obtained from Google Developer Console

export const googlLogin=async(req,res)=>{
  const saltRounds = 10;
  const{tokenId,imageUrl}=req.body.userData //data coming from froentend after response


  try {
     // Verify Google token
     const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: '422908320610-o916m3gohtij3844gilde1fo1tp49719.apps.googleusercontent.com', // The client ID you obtained from Google Developer Console
      });

      const payload = ticket.getPayload();
      const {email,name,jti}=payload
   
      // Check if user exists with the provided email
      const existingUser = await User.findOne({email});
     
    // if not existing user
    if (!existingUser) {   
          // Hash the password
      bcrypt.hash(jti, saltRounds, async (err, hashPass) => {
        if (err) {
          return res.status(500).send("Error hashing password");
        }
        const userdata =new User({
          email:email,
          name:name,
          profilepic:imageUrl,
          password:hashPass,

      })
      await userdata.save();
       

 
      })
       
      }
     

    // Generate JWT token
    const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
    res.status(200).json({
        status: "success",
        message: "Login success!",
        token: token,
        user:{
            email:email,
            name:name,
            profilepic:imageUrl,
      
            }
           
      });

  } catch (error) {
    return res.status(400).json({message:error.message});
  }
}
export default googlLogin;