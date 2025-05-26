const express = require('express');
const app = express();

// MiddleWares
app.use(express.json())

// Routes
app.use("/api/users", require("./user/routes"));
app.use("/api/auth", require("./auth/routes"));


module.exports = app
