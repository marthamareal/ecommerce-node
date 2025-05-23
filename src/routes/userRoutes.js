const express = require("express");
const prisma = require("../db");
const router = express.Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { email } = require("zod/v4");

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

// Register user
router.post("/register", async (req, res) => {
  const validated = userSchema.safeParse(req.body);
  if(!validated.success){
    return res.status(400).json({error: validated.error.flatten().fieldErrors})
  }
  const data = validated.data;

  try {
    const exixts = await prisma.user.findUnique({ where: { email: data.email } });
    if (exixts) return res.status(400).json({ message: "User already exists" });

    // hash password before storage
    hashedPassword = await bcrypt.hash(data.password, 10);
    // Crete user in the database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
