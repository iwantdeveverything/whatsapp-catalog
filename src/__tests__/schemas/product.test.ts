import { describe, it, expect } from "vitest";
import { ProductSchema } from "@/lib/schemas";

describe("ProductSchema", () => {
  it("validates a complete valid product", () => {
    const validProduct = {
      id: "zapatillas-running",
      name: "Zapatillas Running",
      description: "Zapatillas para correr de alta calidad",
      price: 85000,
      images: ["https://example.com/zapatillas.jpg"],
      category: "Calzado",
      contact: {
        whatsapp: "5491112345678",
        phone: "+541112345678",
      },
      isActive: true,
    };

    const result = ProductSchema.parse(validProduct);
    expect(result.id).toBe("zapatillas-running");
    expect(result.name).toBe("Zapatillas Running");
    expect(result.price).toBe(85000);
    expect(result.images).toHaveLength(1);
    expect(result.category).toBe("Calzado");
  });

  it("rejects a product with empty name", () => {
    const invalidProduct = {
      id: "some-id",
      name: "",
      description: "A product",
      price: 100,
      images: ["https://example.com/img.jpg"],
      category: "Test",
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it("rejects a product with name exceeding 80 characters", () => {
    const invalidProduct = {
      id: "some-id",
      name: "A".repeat(81),
      description: "A product",
      price: 100,
      images: ["https://example.com/img.jpg"],
      category: "Test",
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it("rejects a product with description exceeding 300 characters", () => {
    const invalidProduct = {
      id: "some-id",
      name: "Valid Name",
      description: "D".repeat(301),
      price: 100,
      images: ["https://example.com/img.jpg"],
      category: "Test",
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it("rejects a product with empty images array", () => {
    const invalidProduct = {
      id: "some-id",
      name: "Valid Name",
      description: "A product",
      price: 100,
      images: [],
      category: "Test",
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it("rejects a product with invalid image URL", () => {
    const invalidProduct = {
      id: "some-id",
      name: "Valid Name",
      description: "A product",
      price: 100,
      images: ["not-a-url"],
      category: "Test",
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it("accepts 'Consultar' as a valid price", () => {
    const product = {
      id: "some-id",
      name: "Service",
      description: "A service with negotiable price",
      price: "Consultar" as const,
      images: ["https://example.com/img.jpg"],
      category: "Servicios",
    };

    const result = ProductSchema.parse(product);
    expect(result.price).toBe("Consultar");
  });

  it("rejects a negative price", () => {
    const invalidProduct = {
      id: "some-id",
      name: "Valid Name",
      description: "A product",
      price: -50,
      images: ["https://example.com/img.jpg"],
      category: "Test",
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it("defaults isActive to true when not provided", () => {
    const product = {
      id: "some-id",
      name: "Valid Name",
      description: "A product",
      price: 100,
      images: ["https://example.com/img.jpg"],
      category: "Test",
    };

    const result = ProductSchema.parse(product);
    expect(result.isActive).toBe(true);
  });

  it("allows contact to be optional", () => {
    const product = {
      id: "some-id",
      name: "Valid Name",
      description: "A product",
      price: 100,
      images: ["https://example.com/img.jpg"],
      category: "Test",
      isActive: true,
    };

    const result = ProductSchema.parse(product);
    expect(result.contact).toBeUndefined();
  });
});
