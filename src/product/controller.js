const prisma = require("../db");
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
