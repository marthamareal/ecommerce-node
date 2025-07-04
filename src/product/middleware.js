const prisma = require("../db");

const checkProductExists = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product)
        return res
            .status(404)
            .json({ message: "Product with given Id is not found" });

    req.product = product;
    next();
};

const checkOrderExists = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const order = await prisma.order.findUnique(
        {
            where: { id },
            include: { items: { include: { product: true } } },
        }
    );
    if (!order)
        return res
            .status(404)
            .json({ message: "Order with given Id is not found" });

    req.order = order;
    next();
};

module.exports = {
    checkProductExists,
    checkOrderExists
};
