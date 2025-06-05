const validateIdParam = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Id must be an integer' });
    }
    req.id = id;
    next();
};

module.exports = { validateIdParam };
