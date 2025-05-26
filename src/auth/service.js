const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const createAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

const createRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

const createResetPasswordToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_RESET_SECRET,
    { expiresIn: "15m" }
  );
};

// Handle Email Notifications
const tranporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendPasswordResetEmail = async (toEmail, resetLink) => {
    await tranporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Password Reset",
        html: `<p> You have requested to reset your password</p>
        <p> Click <a href=${resetLink}> here </a> to set your new password</p>`
    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    createResetPasswordToken,
    sendPasswordResetEmail
};
