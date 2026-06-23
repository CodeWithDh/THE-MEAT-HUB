import express from "express";
import connectDb from "../config/db.js";
const router =  express.Router();

router.get("/", async (req, res) => {
    try {
        let rData = await connectDb("SELECT * FROM restaurentMenu");
        let mData = await connectDb("SELECT * FROM meatShopMenu");
        res.render("orders", { rData, mData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Server Error");
    }
});

export default router;