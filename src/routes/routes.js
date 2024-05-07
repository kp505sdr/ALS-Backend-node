
import express from "express";
import passport from 'passport';
import "../controllers/users/passport.js"

import { ForgetPassword, ResetPassword, deleteUser, getAllUsers, updateUserProfile, userLogin, userRegistration, verifyemail } from "../controllers/users/userControllers.js";
import authUser from "../middlewares/authUser.js";
import { Comments, Likes, ReportJob, ReviewsFun, Views, getAllJob, getSingleJob, jobCreate, jobUpade, jobdelete } from "../controllers/job/jobControllers.js";
import {PassGoogleFailure, PassGoogleSuccess } from "../controllers/users/GooglePass.js";
import { paymentGateway } from "../controllers/paymentgateway/payment.js";
import { ReceivedMessage, SendMessage } from "../controllers/chatControllers/MessageController.js";
import { createFaq, deleteFaq, getAllFaq, getSingleFaq, updateFaq } from "../controllers/faq/faqControllers.js";
import { createBlogs, deleteBlogs, getAllBlogs, getSingleBlogs, updateBlogs } from "../controllers/blog/blogsControllers.js";






const router=express.Router()
router.use(passport.initialize())
router.use(passport.session())

// ---------user routes---------------------------

router.post("/user/registration",userRegistration) //public
router.post("/user/login",userLogin)//public


router.get("/verifyemail/:id/:token",verifyemail) //EMAILVERIFICATION
router.post("/forgetPassword",ForgetPassword)
router.post("/resetPassword",ResetPassword)
router.post("/paymentGateway",paymentGateway)


router.get("/auth/login", passport.authenticate('google', { scope: ['profile', 'email'] })) //google auth using passpott
// router.get("/auth/google/callback",CallBackFun)

router.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:`${process.env.BASE_URL}/pricing`,  //frontend page
    failureRedirect:`${process.env.BASE_URL}/login`   //frontend page
}))

router.get("/login/success",PassGoogleSuccess);
router.get("/login/failure",PassGoogleFailure)

router.put("/update/user/profile/:id",authUser,updateUserProfile) //authorized user

router.delete("/deleteuser/:id",authUser,deleteUser) //only for admin 
router.get("/get/allusers",authUser,getAllUsers) //only for admin  


//---------------Create--job-----routes------------
router.post("/job/create",authUser,jobCreate) //authorized user
router.put("/job/update/:id",authUser,jobUpade) //authorized user
router.get("/job/get",authUser,getAllJob) //authorized user
router.get("/job/getsingle/:id",authUser,getSingleJob)
router.delete("/job/delete/:id",authUser,jobdelete) //authorized user




//---------------Like,Comment and Views-------------------------
router.put("/job/like/:id",authUser,Likes) //authorized user 
router.put("/job/comment/:id",authUser,Comments) //authorized user 
router.put("/job/reviews/:id",authUser,ReviewsFun) //authorized user 
router.put("/job/report",authUser,ReportJob) //authorized user //report for bad comments
router.put("/job/view/:id",Views)  //public

// --------------------------------chat--------------------------------------------------------
// API route for sending messages
router.post("/send-message/:id",authUser,SendMessage);
router.get("/received-message/:id",authUser,ReceivedMessage);


//-------------------------------FAQ-- only for admin -------------------------------------------
router.post("/create-faq",authUser,createFaq);
router.get("/getall-faq",authUser,getAllFaq);
router.get("/get-single-faq/:id",authUser,getSingleFaq);
router.put("/update-faq/:id",authUser,updateFaq);
router.delete("/delete-faq/:id",authUser,deleteFaq);

// -----------------------------------Blogs----------------------------
router.post("/create-blogs",authUser,createBlogs)
router.put("/update-blogs/:id",authUser,updateBlogs)
router.get("/getall-blogs",getAllBlogs) //public
router.get("/get-single-blogs/:id",getSingleBlogs) //public
router.delete("/delete-blogs/:id",authUser,deleteBlogs)

export default router;