const jwt = require("jsonwebtoken");
const prisma = require("../db");
const sanitize = require("../utils")

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (res.cookies && res.cookies.jwt) {
        token = res.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, Missing token" });
    }
    // Verify and decode tokenn
    try {
        const decoded = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await prisma.user.findUnique({
            where: { email: decoded.email }
        });
        if (!user) res.status(404).json({ message: "User not found" });
        // remove no read fields

        // Pass verified user to the request
        req.user = sanitize(user, ["password", "refreshToken"]);

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized, Invalid token" });
    }
};

module.exports = protect;
