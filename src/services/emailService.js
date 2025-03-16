require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendReferralEmail(toEmail, name) {
  try {
    console.log("🔹 Fetching Access Token...");
    const accessTokenObject = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObject?.token;

    if (!accessToken) throw new Error("Access token not received. Check REFRESH_TOKEN.");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Your App <${GMAIL_USER}>`,
      to: toEmail,
      subject: "Referral Confirmation",
      text: `Hello ${name},\n\nThank you for your referral!\n\nBest regards,\nYour App Team`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
}

// ✅ Ensure function is exported correctly
module.exports = { sendReferralEmail };
