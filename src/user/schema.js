const { z } = require("zod");

// Password Validation
const passwordSchema = z
  .string()
  .min(8, "Password must be atleast 8 characters long")
  .regex(/[a-z]/, "must include a lower case letter")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/\d/, "Must include a digit")
  .regex(/[@$!%*?&]/, "Must include a special character");

// User Validation
const userSchema = z.object({
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
});

module.exports = {
    userSchema,
    passwordSchema
}