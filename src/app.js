const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')

// MiddleWares
app.use(express.json())

// Routes
app.use('/api/auth', userRoutes)

module.exports = app
