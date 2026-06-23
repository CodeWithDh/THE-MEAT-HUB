import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect("/dashboard");
        }
        res.render("login.ejs", { msg: "You're logged Out" });
    });
});

export default router;