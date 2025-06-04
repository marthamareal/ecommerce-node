const prisma = require("../db");
const sanitize = require("../utils");
const {
    productInPutSchema,
    productOutPutSchema,
    cartSchema,
} = require("./schema");

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
        const safeProduct = productOutPutSchema.parse(product);
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
        const deleted = await prisma.product.delete({ where: { id: product.id } });
        if (deleted)
            return res
                .status(200)
                .json({ message: "Product is successfully deleted" });
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
    const product = req.product;
    try {
        // update product in the database
        const updatedproduct = await prisma.product.update({
            where: { id: product.id },
            data,
        });
        const safeProduct = productOutPutSchema.parse(updatedproduct);
        return res.status(201).json(safeProduct);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Cart Routes

exports.addToCart = async (req, res) => {
    const safeData = cartSchema.safeParse(req.body);
    if (!safeData.success) {
        return res
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
    }
    const { productId, quantity } = safeData.data;
    const { userId } = req.user.id;
    try {
        // Find or create user cart
        let cart = await prisma.cart.findFirst({
            where: { userId },
            include: { items: true },
        });
        if (!cart) {
            // Create user cart
            cart = await prisma.cart.create({
                data: { userId },
            });
        }
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Add product to cart through cartItems or increament count if exists on cart
        const item = cart.items.find((item) => item.productId == product.id);
        // calculate Price based on quantity provided
        const price = product.price * quantity;
        if (item) {
            await prisma.cartItem.update({
                where: { id: item.id },
                data: {
                    quantity,
                    price,
                },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    userId,
                    quantity,
                    price,
                },
            });
        }
        return res.status(200).json({ message: "Product added to cart" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getCart = async (req, res) => {
    const { userId } = req.user.id;
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: { items: true },
        });
        if (!cart)
            return res.status(404).json({ message: "No Items added in the cart" });
        return res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.removeFromCart = async (req, res) => {
    const { userId } = req.user.id;
    const productId = req.body?.productId;
    if (!productId) return res.status(400).json({ message: "Missing productId" });
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId }, include: { items: { include: { product: true } } }
        });
        console.log(cart)
        if (!cart) return res.status(404).json({ message: "No products on the cart" });

        const deleted = await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: productId } });
        if (deleted.count == 0) return res.status(404).json({ message: "Product not on the cart" })
        return res
            .status(200)
            .json({ message: "product successfully removed from cart" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
