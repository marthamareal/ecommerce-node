const { z } = require("zod");
const { passwordSchema } = require("../user/schema");

// Email Validation
const emailValidation = z.string().email("Invalid email")


// User Login Validation
const loginSchema = z.object({
    email: emailValidation,
    password: z.string(),
});

// forgotPassword form Validation
const forgotPasswordSchema = z.object({
    email: emailValidation,
});
const resetPasswordSchema = z.object({
    password: passwordSchema
});

module.exports = {
    emailValidation,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
