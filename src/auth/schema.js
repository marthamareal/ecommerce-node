const { z } = require("zod");

// Email Validation
const emailValidation =  z.string().email("Invalid email")


// User Login Validation
const loginSchema = z.object({
  email: emailValidation,
  password: z.string(),
});

module.exports = {
  emailValidation,
  loginSchema,
};
