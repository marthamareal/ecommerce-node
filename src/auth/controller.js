const prisma = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./schema");
const {
  createRefreshToken,
  createAccessToken,
  createResetPasswordToken,
  sendPasswordResetEmail,
} = require("./service");

exports.loginUser = async (req, res) => {
  const validated = loginSchema.safeParse(req.body);
  if (!validated.success)
    return res
      .status(400)
      .json({ error: validated.error.flatten().fieldErrors });

  // check if user exists
  const data = validated.data;
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Check if provided password is matches user password

  const matches = await bcrypt.compare(data.password, user.password);
  if (!matches) return res.status(401).json({ message: "Invalid credentials" });

  // get accessToken and refresh token
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // save refreshToken
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  // remove writeOnly fields
  user.password = undefined;
  user.refreshToken = undefined;
  // Add access token to response
  user.accessToken = accessToken;

  res
    .status(200)
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only true for prod env
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      user,
    });
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.jwt || req.headers["authorization"].split(" ")[1];
  if (!token) res.status(401).json({ message: "No token" });
  try {
    // decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const accessToken = createAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid Refresh Token" });
  }
};

exports.forgotPassword = async (req, res) => {
  const validated = forgotPasswordSchema.safeParse(req.body);
  if (!validated.success)
    res.status(400).json({ error: validated.error.flatten().fieldErrors });
  const { email } = validated.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const token = createResetPasswordToken(user);
    const resetLink = `${process.env.CLIENT_URL}/api/auth/reset-password/${token}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Validate new password meets criteria
    const validated = resetPasswordSchema.safeParse(req.body);
    if (!validated.success)
      res.status(400).json({ error: validated.error.flatten().fieldErrors });
    // hash new password
    const newPassword = await bcrypt.hash(validated.data.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword, refreshToken: null },
    });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid request or expired token" });
  }
};

exports.logoutUser = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) res.status(401).json({ message: "No token" });
  try {
    // decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid Refresh Token" });
  }
};
