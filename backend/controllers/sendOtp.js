// Function to generate OTP
export function createOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// SMS verification
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC04927112f9f5f0e4cd35dc340a002006'; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN || 'b1c039d5f6b8dd06cf5b9c412eeeaf37'; // Your Twilio Auth Token
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+13158884791'; // Your Twilio phone number

const client = twilio(accountSid, authToken);

export async function sendCustomOtp(phoneNumber, otp) {
    try {
        console.log('Sending custom OTP to:', phoneNumber);

        // Send the custom OTP via SMS
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: phoneNumber,
        });

        console.log('Custom OTP sent! Message SID:', message.sid);
        return message.sid;
    } catch (error) {
        console.error('Error sending custom OTP:', error);
        throw error;
    }
}

// Email sending function
import nodemailer from "nodemailer";

export async function sendEmail(email, otp) {
    try {
        const auth = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.GMAIL_USER || "iamuniguy@gmail.com",
                pass: process.env.GMAIL_PASS || "czuv eics xbnk gvhy",
            }
        });

        let receiver = {
            from: "noreply@gmail.com",
            to: email,
            subject: "OTP Verification for Password Reset",
            text: `Your OTP is: ${otp}`
        };

        await auth.sendMail(receiver);
        console.log("OTP Sent Successfully to", email);
    } catch (err) {
        console.error("Error sending email:", err);
    }
}
