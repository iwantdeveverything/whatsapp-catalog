import { describe, it, expect } from "vitest";
import {
  LoginSchema,
  ProductFormSchema,
  CategoryFormSchema,
  SettingsSchema,
} from "@/lib/schemas";

describe("LoginSchema", () => {
  it("accepts valid email and password (≥6 chars)", () => {
    const valid = {
      email: "admin@example.com",
      password: "secret123",
    };

    const result = LoginSchema.parse(valid);
    expect(result.email).toBe("admin@example.com");
    expect(result.password).toBe("secret123");
  });

  it("accepts password exactly 6 characters", () => {
    const valid = {
      email: "admin@example.com",
      password: "123456",
    };

    const result = LoginSchema.parse(valid);
    expect(result.password).toBe("123456");
  });

  it("rejects empty email", () => {
    const invalid = {
      email: "",
      password: "secret123",
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });

  it("rejects invalid email format", () => {
    const invalid = {
      email: "not-an-email",
      password: "secret123",
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });

  it("rejects missing email", () => {
    const invalid = {
      password: "secret123",
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });

  it("rejects password shorter than 6 characters", () => {
    const invalid = {
      email: "admin@example.com",
      password: "12345",
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });

  it("rejects missing password", () => {
    const invalid = {
      email: "admin@example.com",
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });

  it("rejects non-string email", () => {
    const invalid = {
      email: 12345,
      password: "secret123",
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });

  it("rejects non-string password", () => {
    const invalid = {
      email: "admin@example.com",
      password: 123456,
    };

    expect(() => LoginSchema.parse(invalid)).toThrow();
  });
});

describe("ProductFormSchema", () => {
  it("accepts a valid product form", () => {
    const valid = {
      name: "Zapatillas Running",
      description: "Alta calidad",
      price: 85000,
      category: "Calzado",
      isActive: true,
    };

    const result = ProductFormSchema.parse(valid);
    expect(result.name).toBe("Zapatillas Running");
    expect(result.price).toBe(85000);
    expect(result.category).toBe("Calzado");
  });

  it("defaults isActive to true when not provided", () => {
    const valid = {
      name: "Test Product",
      price: 100,
      category: "Test",
    };

    const result = ProductFormSchema.parse(valid);
    expect(result.isActive).toBe(true);
  });

  it("rejects empty name", () => {
    const invalid = {
      name: "",
      price: 100,
      category: "Test",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("rejects missing name", () => {
    const invalid = {
      price: 100,
      category: "Test",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("rejects negative price", () => {
    const invalid = {
      name: "Test",
      price: -50,
      category: "Test",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("rejects zero price", () => {
    const invalid = {
      name: "Test",
      price: 0,
      category: "Test",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("rejects missing price", () => {
    const invalid = {
      name: "Test",
      category: "Test",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("rejects string price", () => {
    const invalid = {
      name: "Test",
      price: "gratis",
      category: "Test",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("rejects missing category", () => {
    const invalid = {
      name: "Test",
      price: 100,
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("accepts optional whatsapp and phone", () => {
    const valid = {
      name: "Test",
      price: 100,
      category: "Test",
      whatsapp: "5491112345678",
      phone: "+541112345678",
    };

    const result = ProductFormSchema.parse(valid);
    expect(result.whatsapp).toBe("5491112345678");
    expect(result.phone).toBe("+541112345678");
  });

  it("accepts valid imageUrl", () => {
    const valid = {
      name: "Test",
      price: 100,
      category: "Test",
      imageUrl: "https://example.com/image.jpg",
    };

    const result = ProductFormSchema.parse(valid);
    expect(result.imageUrl).toBe("https://example.com/image.jpg");
  });

  it("rejects invalid imageUrl", () => {
    const invalid = {
      name: "Test",
      price: 100,
      category: "Test",
      imageUrl: "not-a-url",
    };

    expect(() => ProductFormSchema.parse(invalid)).toThrow();
  });

  it("accepts description as optional", () => {
    const valid = {
      name: "Test",
      price: 100,
      category: "Test",
    };

    const result = ProductFormSchema.parse(valid);
    expect(result.description).toBeUndefined();
  });
});

describe("CategoryFormSchema", () => {
  it("accepts valid category form", () => {
    const valid = {
      name: "Calzado",
      description: "Todo tipo de calzado",
    };

    const result = CategoryFormSchema.parse(valid);
    expect(result.name).toBe("Calzado");
    expect(result.description).toBe("Todo tipo de calzado");
  });

  it("accepts category without description", () => {
    const valid = {
      name: "Calzado",
    };

    const result = CategoryFormSchema.parse(valid);
    expect(result.name).toBe("Calzado");
    expect(result.description).toBeUndefined();
  });

  it("rejects empty name", () => {
    const invalid = {
      name: "",
    };

    expect(() => CategoryFormSchema.parse(invalid)).toThrow();
  });

  it("rejects missing name", () => {
    const invalid = {
      description: "test",
    };

    expect(() => CategoryFormSchema.parse(invalid)).toThrow();
  });
});

describe("SettingsSchema", () => {
  it("accepts all settings fields", () => {
    const valid = {
      catalogName: "Mi Tienda",
      defaultTheme: "shopify",
      whatsappPhone: "5491112345678",
      whatsappTemplate: "Hola, vi {product} y me interesa",
    };

    const result = SettingsSchema.parse(valid);
    expect(result.catalogName).toBe("Mi Tienda");
    expect(result.defaultTheme).toBe("shopify");
    expect(result.whatsappPhone).toBe("5491112345678");
  });

  it("accepts empty object (all fields optional)", () => {
    const result = SettingsSchema.parse({});
    expect(result.catalogName).toBeUndefined();
    expect(result.whatsappTemplate).toBeUndefined();
  });

  it("accepts partial settings", () => {
    const result = SettingsSchema.parse({
      catalogName: "Mi Tienda",
    });
    expect(result.catalogName).toBe("Mi Tienda");
    expect(result.defaultTheme).toBeUndefined();
  });
});
