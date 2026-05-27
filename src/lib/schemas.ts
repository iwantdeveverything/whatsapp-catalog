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

// ── Admin Schemas ──

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const SettingsSchema = z.object({
  catalogName: z.string().optional(),
  defaultTheme: z.string().optional(),
  whatsappPhone: z.string().optional(),
  whatsappTemplate: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type ProductFormInput = z.infer<typeof ProductFormSchema>;
export type CategoryFormInput = z.infer<typeof CategoryFormSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
