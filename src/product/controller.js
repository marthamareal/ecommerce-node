const prisma = require("../db");
const sanitize = require("../utils");
const { productInPutSchema, productOutPutSchema } = require("./schema");

exports.createProduct = async (req, res) => {
    const validated = productInPutSchema.safeParse(req.body);
    if (!validated.success) {
        return res
            .status(400)
            .json({ error: validated.error.flatten().fieldErrors });
    }
    const data = validated.data;

    try {

        // Create product in the database
        const product = await prisma.product.create({ data });
        const safeProduct = productOutPutSchema.parse(product)
        return res.status(201).json(safeProduct);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getProducts = async (req, res) => {
    try {
        // Get products from the database
        const products = await prisma.product.findMany();
        const safeProducts = sanitize(products);
        return res.status(201).json(safeProducts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = req.product;
        const safeProduct = productOutPutSchema.parse(product);
        return res.status(201).json(safeProduct);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = req.product;
        const deleted = await prisma.product.delete({ where: { id: product.id } })
        if (deleted) return res.status(200).json({ message: "Product is successfully deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateProduct = async (req, res) => {
    const validated = productInPutSchema.partial().safeParse(req.body);
    if (!validated.success) {
        return res
            .status(400)
            .json({ error: validated.error.flatten().fieldErrors });
    }
    const data = validated.data;
    const product = req.product
    try {
        // update product in the database
        const updatedproduct = await prisma.product.update({ where: { id: product.id }, data });
        const safeProduct = productOutPutSchema.parse(updatedproduct);
        return res.status(201).json(safeProduct);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
