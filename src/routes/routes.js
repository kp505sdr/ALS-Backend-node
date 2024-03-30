
import express from "express";
import { deleteUser, getAllUsers, updateUserProfile, userLogin, userRegistration } from "../controllers/users/userControllers.js";
import authUser from "../middlewares/authUser.js";
import googlLogin from "../controllers/users/googlelogin.js";


const router=express.Router()



// ---------user routes---------------------------

router.post("/user/registration",userRegistration) //public
router.post("/user/login",userLogin)//public
router.post("/google/login",googlLogin) //public

router.put("/update/user/profile/:id",authUser,updateUserProfile) //authorized user

router.delete("/deleteuser/:id",authUser,deleteUser) //only for admin 
router.get("/get/allusers",authUser,getAllUsers) //only for admin  


//---------------like,comment,views ------routes------------






export default router;