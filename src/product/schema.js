const { z } = require("zod");

const productOutPutSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    description: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});

const productInPutSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(" Price must be greater than 0"),
  description: z.string().nullable().optional(),
});

const cartSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive(" Price must be greater than 0").default(1)
});

module.exports = {
    productInPutSchema,
    productOutPutSchema,
    cartSchema
};
