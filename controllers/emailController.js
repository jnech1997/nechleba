const nodemailer = require("nodemailer");
const perfectExpressSanitizer = require("perfect-express-sanitizer");
const { profanity, CensorType } = require("@2toad/profanity");

/**
 * controllers/emailController.js
 *
 * Simple email sender using nodemailer.
 *
 * Install dependency:
 *   npm install nodemailer
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sanitizer_options = { xss: true, noSql: true, sql: true, level: 5 };

/**
 * sendEmail
 * @param {string} message - plain text message body
 * @returns {Promise<object>} - nodemailer sendMail info
 */
async function sendEmail(message) {
  if (typeof message !== "string" || message.trim() === "") {
    throw new TypeError("message must be a non-empty string");
  }

  if (profanity.exists(message)) {
    throw new Error("message contains inappropriate content");
  }

  message = perfectExpressSanitizer.sanitize.prepareSanitize(
    message,
    (options = sanitizer_options)
  );

  const to = process.env.TO_EMAIL;
  if (!to) throw new Error("Recipient (to) is required");

  const from = process.env.SMTP_USER;
  const subject = "Message from Portfolio Site";

  const mailOptions = {
    from,
    to,
    subject,
    text: message,
    // also provide a simple HTML version
    html: message.replace(/\n/g, "<br>"),
  };

  // optionally verify transporter configuration (first call may take time)
  try {
    await transporter.verify();
  } catch (verifyErr) {
    // verification failed but still attempt to send; throw a more descriptive error
    throw new Error(`SMTP verification failed: ${verifyErr.message}`);
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
}

exports.sendEmail = async function (req, res) {
  try {
    const info = await sendEmail(req.body.message, {});
    return res.status(200).json({ message: "Email sent", info });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
