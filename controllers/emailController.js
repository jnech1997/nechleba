const nodemailer = require("nodemailer");
const { profanity } = require("@2toad/profanity");

const MAX_MESSAGE_LENGTH = 5000;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS on 587
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify the SMTP configuration once at startup instead of on every request.
if (process.env.NODE_ENV !== "test") {
  transporter
    .verify()
    .then(() => console.log("SMTP transporter ready"))
    .catch((err) => console.error("SMTP verification failed:", err.message));
}

class ValidationError extends Error {}

/**
 * Validate and send a contact-form message as plain text.
 * Plain text only: no HTML is built from user input.
 */
async function sendEmail(message) {
  if (typeof message !== "string" || message.trim() === "") {
    throw new ValidationError("Message must be a non-empty string.");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new ValidationError(`Message must be at most ${MAX_MESSAGE_LENGTH} characters.`);
  }
  if (profanity.exists(message)) {
    throw new ValidationError("Message contains inappropriate content.");
  }

  const to = process.env.TO_EMAIL;
  if (!to) throw new Error("TO_EMAIL is not configured");

  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Message from Portfolio Site",
    text: message.trim(),
  });
}

exports.sendEmail = async function (req, res) {
  try {
    await sendEmail(req.body?.message);
    return res.status(200).json({ message: "Email sent" });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
