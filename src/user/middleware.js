const authorizeAccountOwmerOrAdmin = (req, res, next) => {
  // This checks to grant access to only users who are admins and account owners.
  const id = req.params.id;
  const user = req.user; // Passed from protect middleware

  if (!(user.id == id) && !user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Not allowed" });
  }
  next();
};

const checkUserExists = async (req, res, next) => {
  // This checks if user with given id exists.
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  req.user = user
  next();
};

module.exports = { authorizeAccountOwmerOrAdmin, checkUserExists };
