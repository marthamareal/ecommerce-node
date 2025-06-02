const prisma = require("../db");
const bcrypt = require("bcrypt");
const { userSchema } = require("./schema")

exports.createUser = async (req, res) => {
      const validated = userSchema.safeParse(req.body);
      if (!validated.success) {
        return res
          .status(400)
          .json({ error: validated.error.flatten().fieldErrors });
      }
      const data = validated.data;

      try {
        const exixts = await prisma.user.findUnique({
          where: { email: data.email },
        });
        if (exixts)
          return res.status(400).json({ message: "User already exists" });

        // hash password before storage
        hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user in the database
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
};
