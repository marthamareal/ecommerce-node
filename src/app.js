const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

// MiddleWares
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/users", require("./user/routes"));
app.use("/api/auth", require("./auth/routes"));


module.exports = app
