import express from "express";
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("login.ejs",{msg:''});
})

export default router;