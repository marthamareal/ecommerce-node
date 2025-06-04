const authorizeAccountOwmerOrAdmin = async (req, res, next) => {
  // This checks to grant access to only users who are admins and account owners.
  const id = req.params.id;
  const user = req.user; // Passed from protect middleware

  if (!(user.id == id) && !user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Not allowed" });
  }
  next();
};

module.exports = authorizeAccountOwmerOrAdmin
