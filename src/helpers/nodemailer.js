const nodemailer = require("nodemailer");
const key = require("./key.json");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: "true",
  auth: {
    type: "OAuth2",
    user: "support@trustfxpro.com",
    serviceClient: key.client_id,
    privateKey: key.private_key,
  },
});

async function SendVerificationEmail(user, FrontendUrl) {
  try {
    const signUpData = {
      from: "support@trustfxpro.com",
      to: `${user.email}`,
      subject: "Verify your email",
      text: `Welcome ${user.firstname},\nClick ${FrontendUrl}/verify/${user.id} to verify your email.`,
    };
    await transporter.verify();
    await transporter.sendMail(signUpData);
  } catch (err) {
    console.error(err);
  }
}

async function SendRecoveryEmail(user, FrontendUrl) {
  try {
    const recoveryData = {
      from: "support@trustfxpro.com",
      to: `${user.email}`,
      subject: "Reset Password",
      text: `Good day ${user.firstname},\nClick ${FrontendUrl}/recovery/${user.id} to reset your password.\n\n\n If you didn't request this action, please ignore this message.`,
    };
    await transporter.verify();
    await transporter.sendMail(recoveryData);
  } catch (err) {
    console.error(err);
  }
}

module.exports.SendVerificationEmail = SendVerificationEmail;
module.exports.SendRecoveryEmail = SendRecoveryEmail;
