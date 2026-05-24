import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(80),
  description: z.string().max(300),
  price: z.union([z.number().positive(), z.literal("Consultar")]),
  images: z.array(z.string().url()).min(1),
  category: z.string(),
  contact: z
    .object({
      whatsapp: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

export const CatalogSchema = z.object({
  businessName: z.string().min(1),
  description: z.string().min(1),
  products: z.array(ProductSchema),
});

export type Product = z.infer<typeof ProductSchema>;
export type Catalog = z.infer<typeof CatalogSchema>;
