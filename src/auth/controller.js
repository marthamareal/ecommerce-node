const prisma = require("../db");
const bcrypt = require("bcrypt")
const { userSchema } = require("../user/schema");
const { loginSchema } = require("./schema");
const { createRefreshToken, createAccessToken } = require("./service");

exports.loginUser = async (req, res) => {
    const validated = loginSchema.safeParse(req.body);
    if (!validated.success) return res.status(400).json({ error: validated.error.flatten().fieldErrors });

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
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })

    // remove writeOnly fields
    user.password = undefined;
    user.refreshToken = undefined
    // Add access token to response
    user.accessToken = accessToken

    res
    .status(200).json(
        {
            user
        }
    );
};
