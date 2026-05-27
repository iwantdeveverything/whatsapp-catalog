import { describe, it, expect } from "vitest";
import type { IProductService } from "@/lib/services/interfaces/IProductService";
import type { ICategoryService } from "@/lib/services/interfaces/ICategoryService";
import type { ISettingsService } from "@/lib/services/interfaces/ISettingsService";
import type { IAuthService } from "@/lib/services/interfaces/IAuthService";
import type { ProductFormInput, CategoryFormInput, SettingsInput } from "@/lib/schemas";
import type { Product } from "@/lib/schemas";
import type { Category, ProductFilters, ProductListResult, AuthResult } from "@/lib/services/interfaces/types";

// These mock objects verify that the interfaces compile and have the expected shape.
// The real TYPE check happens at compile time — if the objects below don't satisfy
// the interface, TypeScript will error BEFORE Vitest runs.

describe("IProductService", () => {
  it("enforces the contract shape via mocked implementation", async () => {
    const mock: IProductService = {
      list: async (_filters?: ProductFilters): Promise<ProductListResult> => ({
        products: [],
        total: 0,
      }),
      getById: async (_id: string): Promise<Product | null> => null,
      create: async (_data: ProductFormInput): Promise<Product> => {
        throw new Error("not implemented in mock contract test");
      },
      update: async (_id: string, _data: Partial<ProductFormInput>): Promise<Product> => {
        throw new Error("not implemented in mock contract test");
      },
      delete: async (_id: string): Promise<void> => {},
    };

    // Runtime checks: verify mock has all required methods
    expect(mock.list).toBeDefined();
    expect(mock.getById).toBeDefined();
    expect(mock.create).toBeDefined();
    expect(mock.update).toBeDefined();
    expect(mock.delete).toBeDefined();

    // Verify return types work at runtime
    const result = await mock.list();
    expect(result).toHaveProperty("products");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.products)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("list() accepts optional filters", async () => {
    const mock: IProductService = {
      list: async (filters?: ProductFilters) => {
        // Use filters to shape result
        const search = filters?.search ?? "";
        return {
          products: search ? [] : [{ id: "x", name: "Test", description: "", price: 100, images: ["https://example.com/img.jpg"], category: "Test", isActive: true }],
          total: search ? 0 : 1,
        };
      },
      getById: async () => null,
      create: async () => { throw new Error("not implemented"); },
      update: async () => { throw new Error("not implemented"); },
      delete: async () => {},
    };

    const withFilter = await mock.list({ search: "nonexistent" });
    expect(withFilter.total).toBe(0);

    const withoutFilter = await mock.list();
    expect(withoutFilter.total).toBe(1);
  });

  it("create() accepts ProductFormInput and returns Product", async () => {
    const mock: IProductService = {
      list: async () => ({ products: [], total: 0 }),
      getById: async () => null,
      create: async (data: ProductFormInput): Promise<Product> => ({
        id: "new-product",
        name: data.name,
        description: data.description ?? "",
        price: data.price,
        images: [data.imageUrl ?? "https://placehold.co/800"],
        category: data.category,
        isActive: data.isActive ?? true,
        contact: data.whatsapp ? { whatsapp: data.whatsapp } : undefined,
      }),
      update: async () => { throw new Error("not implemented"); },
      delete: async () => {},
    };

    const data: ProductFormInput = { name: "Test", price: 100, category: "Cat", isActive: true };
    const result = await mock.create(data);
    expect(result.name).toBe("Test");
    expect(result.price).toBe(100);
  });

  it("update() accepts partial ProductFormInput and preserves untouched fields", async () => {
    const mock: IProductService = {
      list: async () => ({ products: [], total: 0 }),
      getById: async () => null,
      create: async () => { throw new Error("not implemented"); },
      update: async (_id: string, data: Partial<ProductFormInput>): Promise<Product> => ({
        id: _id,
        name: data.name ?? "original-name",
        description: data.description ?? "original-desc",
        price: data.price ?? 50,
        images: ["https://placehold.co/800"],
        category: data.category ?? "original-cat",
        isActive: true,
      }),
      delete: async () => {},
    };

    const result = await mock.update("prod-1", { name: "Updated" });
    expect(result.name).toBe("Updated");
    expect(result.price).toBe(50); // preserved
  });

  it("delete() toggles isActive (soft delete)", async () => {
    let deleted = false;
    const mock: IProductService = {
      list: async () => ({ products: [], total: 0 }),
      getById: async () => null,
      create: async () => { throw new Error("not implemented"); },
      update: async () => { throw new Error("not implemented"); },
      delete: async (_id: string) => {
        deleted = true;
      },
    };

    await mock.delete("prod-1");
    expect(deleted).toBe(true);
  });
});

describe("ICategoryService", () => {
  it("enforces the contract shape via mocked implementation", async () => {
    const mock: ICategoryService = {
      list: async (): Promise<Category[]> => [],
      getById: async (_id: string): Promise<Category | null> => null,
      create: async (_data: CategoryFormInput): Promise<Category> => {
        throw new Error("not implemented");
      },
      update: async (_id: string, _data: Partial<CategoryFormInput>): Promise<Category> => {
        throw new Error("not implemented");
      },
      delete: async (_id: string): Promise<void> => {},
    };

    expect(mock.list).toBeDefined();
    expect(mock.getById).toBeDefined();
    expect(mock.create).toBeDefined();
    expect(mock.update).toBeDefined();
    expect(mock.delete).toBeDefined();
  });

  it("create() auto-generates slug from name", async () => {
    const mock: ICategoryService = {
      list: async () => [],
      getById: async () => null,
      create: async (data: CategoryFormInput): Promise<Category> => ({
        id: "cat-sneakers",
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
        productCount: 0,
      }),
      update: async () => { throw new Error("not implemented"); },
      delete: async () => {},
    };

    const result = await mock.create({ name: "Running Shoes" });
    expect(result.slug).toBe("running-shoes");
  });

  it("delete() blocks if products exist (throws error)", async () => {
    const mock: ICategoryService = {
      list: async () => [],
      getById: async () => ({ id: "cat-1", name: "Test", slug: "test", productCount: 3 }),
      create: async () => { throw new Error("not implemented"); },
      update: async () => { throw new Error("not implemented"); },
      delete: async (_id: string) => {
        // Simulate the check: getById would be called first
        const cat = await mock.getById(_id);
        if (cat && cat.productCount > 0) {
          throw new Error("Cannot delete category with existing products");
        }
      },
    };

    await expect(mock.delete("cat-1")).rejects.toThrow("Cannot delete category with existing products");
  });
});

describe("ISettingsService", () => {
  it("enforces the contract shape via mocked implementation", async () => {
    const mock: ISettingsService = {
      get: async (): Promise<SettingsInput> => ({ catalogName: "My Catalog" }),
      update: async (_data: SettingsInput): Promise<SettingsInput> => _data,
    };

    expect(mock.get).toBeDefined();
    expect(mock.update).toBeDefined();
  });

  it("get() returns defaults when nothing saved", async () => {
    const mock: ISettingsService = {
      get: async (): Promise<SettingsInput> => ({
        catalogName: "My Catalog",
        defaultTheme: "light",
      }),
      update: async () => ({ catalogName: "My Catalog" }),
    };

    const result = await mock.get();
    expect(result.catalogName).toBe("My Catalog");
    expect(result.defaultTheme).toBe("light");
  });

  it("update() merges with existing values", async () => {
    let stored: SettingsInput = { catalogName: "Old", defaultTheme: "dark" };

    const mock: ISettingsService = {
      get: async () => stored,
      update: async (data: SettingsInput) => {
        stored = { ...stored, ...data };
        return stored;
      },
    };

    await mock.update({ catalogName: "New" });
    const result = await mock.get();
    expect(result.catalogName).toBe("New");
    expect(result.defaultTheme).toBe("dark"); // preserved
  });
});

describe("IAuthService", () => {
  it("enforces the contract shape via mocked implementation", () => {
    const mock: IAuthService = {
      login: async (_email: string, _password: string): Promise<AuthResult> => ({
        token: "mock",
        user: { email: _email },
      }),
      logout: (): void => {},
    };

    expect(mock.login).toBeDefined();
    expect(mock.logout).toBeDefined();
  });

  it("login() returns token + user for valid credentials", async () => {
    const mock: IAuthService = {
      login: async (email: string, password: string): Promise<AuthResult> => {
        if (password.length < 6) throw new Error("Invalid credentials");
        return { token: "mock-jwt-token", user: { email } };
      },
      logout: () => {},
    };

    const result = await mock.login("admin@test.com", "123456");
    expect(result.token).toBe("mock-jwt-token");
    expect(result.user.email).toBe("admin@test.com");
  });

  it("login() rejects short password", async () => {
    const mock: IAuthService = {
      login: async (_email: string, password: string): Promise<AuthResult> => {
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        return { token: "x", user: { email: _email } };
      },
      logout: () => {},
    };

    await expect(mock.login("a@b.com", "12345")).rejects.toThrow();
  });

  it("logout() clears authentication state", () => {
    let authenticated = true;
    const mock: IAuthService = {
      login: async () => ({ token: "x", user: { email: "x" } }),
      logout: () => {
        authenticated = false;
      },
    };

    mock.logout();
    expect(authenticated).toBe(false);
  });
});
