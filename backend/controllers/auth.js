import { updatePass, getAdminDetails } from "../config/auth.js";
import { createOtp, sendCustomOtp, sendEmail } from "./sendOtp.js";

export async function authCheck(email, phone) {
    const adminDetails = await getAdminDetails();
    if (!adminDetails) {
        return { message: 'incorrect', otpMsg: 'Admin not found' };
    }

    if (email === adminDetails.email && phone === String(adminDetails.phone)) {
        let otp = createOtp();
        await sendEmail(adminDetails.email, otp);

        const phoneNumber = '+91' + phone; 
        try {
            const sid = await sendCustomOtp(phoneNumber, otp);
            console.log('Custom OTP sent successfully! Message SID:', sid);
        } catch (error) {
            console.error('Failed to send custom OTP:', error);
            // Twilio failed but we can still return success for email.
        }

        return { message: "clear", otpMsg: 'null', otp };
    } else {
        return { message: 'incorrect', otpMsg: 'NotNull' };
    }
}

export async function authVerify(providedOtp, sentOtp) {
    if (!sentOtp || providedOtp !== sentOtp) {
        return { message: 'clear', otpMsg: 'Wrong Otp' };
    } else {
        return { message: "verified", otpMsg: "null" };
    }
}

export async function setNewPass(newPass, confirmPass) {
    if (newPass === confirmPass) {
        let result = await updatePass(newPass);
        console.log(result);
        if (result === true) {
            return true;
        } else {
            console.log("Password changing error");
            return false;
        }
    } else {
        return false;
    }
}
