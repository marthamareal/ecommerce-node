const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');

// MiddleWares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}));

// Routes
app.use("/api/users", require("./user/routes"));
app.use("/api/auth", require("./auth/routes"));
app.use("/api/products", require("./product/routes"));


module.exports = app
