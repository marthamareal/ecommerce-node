const prisma = require("../db");
const bcrypt = require("bcrypt");
const { userSchema } = require("./schema");
const sanitize = require("../utils");

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
    const safeUser = sanitize(user, ["password", "refreshToken"]);
    return res.status(201).json(safeUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  const user = req.user
  try {
    const safeUser = sanitize(user, ["password", "refreshToken"])
    return res.status(200).json(safeUser)
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const safeUsers = sanitize(users, ["password", "refreshToken"]);
    return res.status(200).json(safeUsers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.user.id;
  const updates = req.body;
  try {
    const safeData = sanitize(updates, ["password", "refreshToken"]);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: safeData,
    });
    const safeUser = sanitize(updatedUser, ["password", "refreshToken"])
    return res.status(200).json(safeUser)
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.user.id;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id }
    })
    if (deletedUser) return res.status(200).json({ message: "User account successfully deleted" })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Server error" })
  }
};
