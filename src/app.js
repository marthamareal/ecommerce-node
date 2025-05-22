const express = require('express');
const app = express();

// MiddleWares
app.use(express.json())

module.exports = app
