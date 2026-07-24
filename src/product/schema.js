const { z } = require("zod");

const CategoryOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const ProductImageOutPutSChema = z.object({
  id: z.number(),
  key: z.string().min(1),
  url: z.string().url,
});

const productOutPutSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  images: z.array(ProductImageOutPutSChema).nullable().optional(),
  category: CategoryOutputSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

const productInPutSchema = z.object({
  name: z.string().min(3),
  categoryId: z.number(),
  featured: z.boolean().default(false),
  price: z.number().positive(" Price must be greater than 0"),
  description: z.string().nullable().optional(),
  images: z.array(z.object({ url: z.string().url })).default([])
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
