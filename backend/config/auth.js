

import connectDb from "./db.js";

export async function updatePass(newPass) {
    const q = "UPDATE login SET password = ? WHERE username = 'admin'";

    try {
        let res = await connectDb(q, [newPass]);
        console.log("Update Response:", res);
        return true;  // ✅ Return true on success
    } catch (err) {
        console.error("Database Error:", err);
        return false; // ✅ Return false on failure
    }
}





export async function getAdminDetails() {
    const q = "SELECT * FROM login WHERE username = 'admin'";
    try {
        let data = await connectDb(q);
        if (data && data.length > 0) {
            return { email: data[0].email, phone: data[0].phone };
        }
    } catch (err) {
        console.error("Database Error:", err);
    }
    return null;
}


