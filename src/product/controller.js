const prisma = require("../db");
const sanitize = require("../utils");
const {
    productInPutSchema,
    productOutPutSchema,
    cartSchema,
} = require("./schema");

exports.getCategories = async (req, res) => {
    try {
        // Get products from the database
        const categories = await prisma.category.findMany();
        return res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Creates the Product row and its ProductImage rows in a single transaction.
//  * The first image in the array becomes the cover(isPrimary) by convention —
//  * the frontend controls order by the order it sends the array in.
exports.createProduct = async (req, res) => {
    const validated = productInPutSchema.safeParse(req.body);
    if (!validated.success) {
        return res
            .status(400)
            .json({ error: validated.error.flatten().fieldErrors });
    }

    const { images, ...productData } = validated.data;

    try {
        const product = await prisma.$transaction(async (tx) => {
            const created = await tx.product.create({
                data: productData,
            });

            if (images.length > 0) {
                await tx.productImage.createMany({
                    data: images.map((img, index) => ({
                        productId: created.id,
                        key: img.key,
                        url: img.url,
                        position: index,
                        isPrimary: index === 0,
                    })),
                });
            }
            // Re-fetch with images included so the response matches what the
            // frontend needs to render immediately without a second request.
            return tx.product.findUnique({
                where: { id: created.id },
                include: { category: true, images: { orderBy: { id: "asc" } } },
            });
        });

        const safeProduct = productOutPutSchema.parse(product);
        return res.status(201).json(safeProduct);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "" // search in product name
    const category = req.query.category ? Number(req.query.category) : undefined // filtering by category
    const featured = req.query.featured // filtering featured products
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    try {
        // Construct a query to see in searching the product name and filtering by category.
        const where = {
            AND: [
                category ? { category: { id: category } } : {},
                featured != undefined ? { featured: featured === "true" } : {},
                searchTerm
                    ? {
                        OR: [
                            { name: { contains: searchTerm, mode: 'insensitive' } },
                            { description: { contains: searchTerm, mode: 'insensitive' } },
                            { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
                        ],
                    }
                    : {},
                (minPrice || maxPrice)
                    ? {
                        price: {
                            ...(minPrice ? { gte: Number(minPrice) } : {}),
                            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
                        },
                    }
                    : {},
            ]
        }

        // Get products from the database
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take: limit,
                where,
                orderBy: { createdAt: "desc" },
                include: {
                    images: { where: { isPrimary: true }, take: 1 },
                    category: true
                }
            }),
            prisma.product.count({
                where,
            }),
        ])
        const safeProducts = sanitize(products);
        return res.status(200).json({
            page,
            pages: Math.ceil(total / limit),
            total,
            data: safeProducts
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getProduct = async (req, res) => {
    try {
        // The product in request is got from db in the checkProductExists middleware
        const product = req.product;
        const safeProduct = productOutPutSchema.parse(product);
        return res.status(200).json(safeProduct);
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
    const userId = req.user.id;
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
        const item = cart?.items?.find((item) => item.productId == product.id);
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
    const userId = req.user.id;
    try {
        let cart = await prisma.cart.findFirst({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        if (!cart)
            // create cart
            cart = await prisma.cart.create({
                data: { userId },
            });
        return res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.body?.productId;
    if (!productId) return res.status(400).json({ message: "Missing productId" });
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId }
        });
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

exports.createOrder = async (req, res) => {
    const userId = req.user.id
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        if (!cart || cart.items.length == 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        // Calculate total amount from cartItems
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        // Create orede and order items
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }, include: { items: true }
        })

        if (order) {
            // clear the cart if order is created successfully
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
        }
        return res.status(201).json(order)
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getOrder = async (req, res) => {
    const order = req.order
    return res.status(200).json(order)
};

exports.getOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
    const dateTo = req.query.dateTo ? new Date(new Date(req.query.dateTo).setHours(23, 59, 59, 999)) : null;

    const userId = req.user.id;
    try {
        const where = {
            userId,
            AND: [
                dateFrom || dateTo
                    ? {
                        createdAt: {
                            ...(dateFrom ? { gte: dateFrom } : {}),
                            ...(dateTo ? { lte: dateTo } : {}),
                        },
                    }
                    : {}
            ]
        }
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                where,
                include: { items: true },
                orderBy: { createdAt: "desc" },
            }),
            prisma.order.count({ where: { userId } })
        ]);
        if (!orders)
            return res.status(404).json({ message: "No orders added yet" });

        return res.status(200).json({
            page,
            pages: Math.ceil(total / limit),
            total,
            data: orders
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const order = req.order;
    const status = req.body?.status;
    const validStatuses = ["PENDING", "REJECTED", "ACCEPTED", "CANCLED", "PROCESSED"]
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            message: `status is required, and avalid status  must be includeded in [${validStatuses}]`
        })
    }
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: { status },
            include: { items: true }
        })
        res.status(200).json(updatedOrder)
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
