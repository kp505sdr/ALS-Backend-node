import mongoose from "mongoose"


const userModels= new mongoose.Schema({
  
  name:{
     type:String,
   },
  
   email:{
    type:String,
    required:true
  },
  mobile:{
    type:Number,
 
  },

  profilepic:{
    type:String,
  },

  isAdmin:{
    type:Boolean,
    default:false,
  },
  socialMedia:{
    type:Array,  
  },
  gender:{
type:String
  },
  password:{
    type:String,
    required:true
   
  },



 
})
export default mongoose.model("User",userModels)