import connectDb from "../config/db.js";

async function loginCheck(username, pass) {
    if (!username || !pass) {
        console.log("No credentials found");
        return false;
    }

    try {
        const q = "SELECT * FROM login WHERE username = ?";
        const data = await connectDb(q, [username]);

        if (data && data.length > 0) {
            if (data[0].password === pass) {
                return true;
            } else {
                console.log("wrong credentials");
                return false;
            }
        } else {
            console.log("No credentials found");
            return false;
        }
    } catch (error) {
        console.error("Login check error:", error);
        return false;
    }
}

export default loginCheck;
