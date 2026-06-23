import express from "express";
const router=express.Router();

import {authCheck,authVerify,setNewPass} from "../controllers/auth.js";


router.get("/",(req,res)=>{
    res.render("auth.ejs",{message:''});
})

router.post("/check",async(req,res)=>{
    let {email,phone}=req.body;
    let {message,otpMsg,otp}=await authCheck(email,phone);

    if (otp) {
        req.session.otp = otp;
    }

    console.log(message,otpMsg);
    res.render("auth.ejs",{message,otpMsg});
})


router.post("/verify",async(req,res)=>{
    let providedOtp=req.body.otp;
    let sentOtp = req.session.otp;
    let {message,otpMsg}=await authVerify(providedOtp,sentOtp);
    if(message === "verified"){
        delete req.session.otp;
    }
    res.render("auth.ejs",{message,otpMsg});
})

router .post("/newpass",async(req,res)=>{
    let {newPassword,confirmPassword} = req.body;
    await setNewPass(newPassword,confirmPassword).then((response)=>{
        if(response===true){
            req.session.destroy((err) => {
                res.render("login.ejs",{msg:'Password Changed'});
            });
        }else{
            res.render("auth.ejs",{ message: "clear", otpMsg: 'New Password Mismatched \n Authenticate Again' });
        }
    })
    
})

export default router;