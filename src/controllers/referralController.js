const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendReferralEmail } = require("../services/emailService")

const createReferral = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    // if (!isValidEmail(email)) {
    //   return res.status(400).json({ error: "Invalid email format. Please provide a valid email address." });
    // }

    // Check if the email already exists
    const existingReferral = await prisma.referral.findUnique({
      where: { email },
    });

    if (existingReferral) {
      return res.status(400).json({ error: "This email has already been used for a referral." });
    }

    // Save referral data in database
    const newReferral = await prisma.referral.create({
      data: {
        name,
        email,
        phone: String(phone),
        message,
      },
    });

    // Send referral email
    await sendReferralEmail(email, name);

    res.status(201).json({ message: "Referral submitted and email sent!", referral: newReferral });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {createReferral};