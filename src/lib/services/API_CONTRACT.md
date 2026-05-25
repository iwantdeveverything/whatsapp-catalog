# API Contract — Admin Panel Backend

> **Target audience**: Backend developers (Laravel, Express, etc.)
> **Self-contained**: This document includes everything needed to implement the API.
> All request/response shapes reference Zod schemas defined in `src/lib/schemas.ts`.

---

## Authentication

All admin endpoints require authentication via the `admin-token` cookie set by the login endpoint.
The middleware should check for its presence on every `/api/admin/*` request.

### Token format

```json
{
  "token": "string (JWT)",
  "user": {
    "email": "string"
  }
}
```

---

## 1. Auth

### POST /api/auth/login

**Request Body** — `LoginSchema`

| Field      | Type   | Required | Validation       |
| ---------- | ------ | -------- | ---------------- |
| `email`    | string | ✅       | Valid email      |
| `password` | string | ✅       | Min 6 characters |

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

**Response 200** — `AuthResult`

```json
{
  "token": "jwt-token-string",
  "user": {
    "email": "admin@example.com"
  }
}
```

**Response 401** — Invalid credentials

```json
{
  "error": "Invalid email or password"
}
```

Also sets `Set-Cookie: admin-token={token}; Path=/; HttpOnly; Secure; SameSite=Strict`.

---

## 2. Products

Base path: `/api/products`

### 2.1 GET /api/products

List all active products with optional filtering and sorting.

**Query Parameters**

| Param      | Type   | Required | Description                               |
| ---------- | ------ | -------- | ----------------------------------------- |
| `search`   | string | ❌       | Case-insensitive name search              |
| `category` | string | ❌       | Exact category match (case-insensitive)   |
| `sortBy`   | string | ❌       | `"name"` or `"price"`                     |
| `sortOrder`| string | ❌       | `"asc"` (default) or `"desc"`             |

**Response 200** — `ProductListResult`

```json
{
  "products": [
    {
      "id": "zapatillas-running",
      "name": "Zapatillas Running",
      "description": "Zapatillas ultralivianas...",
      "price": 85000,
      "images": ["https://placehold.co/800x800/..."],
      "category": "Calzado",
      "contact": {
        "whatsapp": "5491112345678",
        "phone": "+541112345678"
      },
      "isActive": true
    }
  ],
  "total": 7
}
```

**Product object** — `Product` (inferred from `ProductSchema`)

| Field         | Type                      | Required | Description                     |
| ------------- | ------------------------- | -------- | ------------------------------- |
| `id`          | string (1–100 chars)      | ✅       | Unique slug-based identifier    |
| `name`        | string (1–80 chars)       | ✅       | Product name                    |
| `description` | string (max 300 chars)    | ✅       | Product description             |
| `price`       | number \| `"Consultar"`   | ✅       | Positive number or "Consultar"  |
| `images`      | string[] (URLs, min 1)    | ✅       | Product image URLs              |
| `category`    | string                    | ✅       | Category name                   |
| `contact`     | object?                   | ❌       | Contact info                    |
| `isActive`    | boolean                   | ✅       | Soft-delete flag (default true) |

### 2.2 GET /api/products/:id

Get a single product by ID (includes inactive products).

**Response 200** — `Product`

```json
{
  "id": "zapatillas-running",
  "name": "Zapatillas Running",
  "description": "...",
  "price": 85000,
  "images": ["https://..."],
  "category": "Calzado",
  "isActive": true
}
```

**Response 404** — Not found

### 2.3 POST /api/products

Create a new product.

**Request Body** — `ProductFormSchema`

| Field         | Type    | Required | Validation              |
| ------------- | ------- | -------- | ----------------------- |
| `name`        | string  | ✅       | Min 1 character         |
| `description` | string  | ❌       |                         |
| `price`       | number  | ✅       | Positive (> 0)          |
| `category`    | string  | ✅       | Min 1 character         |
| `whatsapp`    | string  | ❌       | WhatsApp number         |
| `phone`       | string  | ❌       | Phone number            |
| `imageUrl`    | string  | ❌       | Valid URL               |
| `isActive`    | boolean | ❌       | Default: `true`         |

```json
{
  "name": "Nuevo Producto",
  "price": 15000,
  "category": "Calzado",
  "description": "Descripción opcional",
  "imageUrl": "https://example.com/photo.jpg",
  "isActive": true
}
```

**Response 201** — `Product`

The `id` is auto-generated as a slug from the product name (lowercase, special chars replaced with hyphens).

### 2.4 PUT /api/products/:id

Update an existing product. Only provided fields are updated; others are preserved.

**Request Body** — `Partial<ProductFormSchema>` (all fields optional)

```json
{
  "name": "Nombre Actualizado",
  "price": 20000
}
```

**Response 200** — `Product` (updated)

**Response 404** — Not found

### 2.5 DELETE /api/products/:id

Soft-delete a product (sets `isActive` to `false`). The product remains retrievable by ID but is excluded from list results.

**Response 204** — No content

**Response 404** — Not found

---

## 3. Categories

Base path: `/api/categories`

### 3.1 GET /api/categories

List all categories with product counts.

**Response 200** — `Category[]`

```json
[
  {
    "id": "calzado",
    "name": "Calzado",
    "slug": "calzado",
    "description": "Todo tipo de calzado",
    "productCount": 2
  }
]
```

**Category object** — `Category`

| Field          | Type    | Required | Description                      |
| -------------- | ------- | -------- | -------------------------------- |
| `id`           | string  | ✅       | Unique slug-based identifier     |
| `name`         | string  | ✅       | Category display name            |
| `slug`         | string  | ✅       | URL-safe slug (auto-generated)   |
| `description`  | string? | ❌       | Optional description             |
| `productCount` | number  | ✅       | Number of products in category   |

### 3.2 GET /api/categories/:id

Get a single category by ID.

**Response 200** — `Category`

**Response 404** — Not found

### 3.3 POST /api/categories

Create a new category.

**Request Body** — `CategoryFormSchema`

| Field         | Type   | Required | Validation      |
| ------------- | ------ | -------- | --------------- |
| `name`        | string | ✅       | Min 1 character |
| `description` | string | ❌       |                 |

```json
{
  "name": "Electrónicos",
  "description": "Productos electrónicos y gadgets"
}
```

**Response 201** — `Category`

The `slug` is auto-generated from the name (lowercase, spaces → hyphens, special chars removed). The `id` is derived from the slug (suffixed if duplicate).

### 3.4 PUT /api/categories/:id

Update an existing category. If `name` changes, `slug` is regenerated.

**Request Body** — `Partial<CategoryFormSchema>` (all fields optional)

```json
{
  "name": "Electrónicos Actualizados",
  "description": "Nueva descripción"
}
```

**Response 200** — `Category` (updated)

**Response 404** — Not found

### 3.5 DELETE /api/categories/:id

Delete a category. **Fails with 409** if any products reference this category (`productCount > 0`).

**Response 204** — No content (deleted successfully)

**Response 409** — Conflict

```json
{
  "error": "Cannot delete category with existing products"
}
```

**Response 404** — Not found

---

## 4. Settings

Base path: `/api/settings`

### 4.1 GET /api/settings

Get current application settings.

**Response 200** — `SettingsInput` (inferred from `SettingsSchema`)

```json
{
  "catalogName": "My Catalog",
  "defaultTheme": "light",
  "whatsappPhone": "5491112345678",
  "whatsappTemplate": "Hola, vi {product} en tu catálogo..."
}
```

All fields are optional. Returns defaults for unset values.

### 4.2 PUT /api/settings

Update application settings. Merges with existing settings — only provided fields are changed.

**Request Body** — `SettingsSchema`

| Field              | Type   | Required | Description                       |
| ------------------ | ------ | -------- | --------------------------------- |
| `catalogName`      | string | ❌       | Business/catalog display name     |
| `defaultTheme`     | string | ❌       | Theme name (e.g., "light", "dark")|
| `whatsappPhone`    | string | ❌       | Default WhatsApp contact number   |
| `whatsappTemplate` | string | ❌       | Default message template          |

```json
{
  "catalogName": "Mi Catálogo",
  "defaultTheme": "dark"
}
```

**Response 200** — `SettingsInput` (full merged settings)

---

## 5. Error Response Format

All error responses follow this structure:

```json
{
  "error": "Human-readable error message"
}
```

**HTTP Status Codes**

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 200  | Success (GET, PUT)                 |
| 201  | Created (POST)                     |
| 204  | No content (DELETE)                |
| 400  | Validation error                   |
| 401  | Unauthorized (missing/invalid JWT) |
| 404  | Resource not found                 |
| 409  | Conflict (e.g., delete with deps)  |
| 500  | Internal server error              |

---

## 6. Implementation Notes

1. **Authentication**: The `admin-token` cookie is set by `POST /api/auth/login` and must be validated by middleware on all other `/api/*` routes.
2. **Validation**: Use the Zod schemas from `src/lib/schemas.ts` as the source of truth for request body validation.
3. **Slug generation**: Product IDs and Category slugs are auto-generated from names:
   - Lowercase the name
   - Strip accents (NFD normalization)
   - Replace non-alphanumeric characters with hyphens
   - Remove leading/trailing hyphens
   - If duplicate, append `-2`, `-3`, etc.
4. **Soft delete**: `DELETE /api/products/:id` sets `isActive: false` rather than removing the record. `GET /api/products/:id` still returns soft-deleted products; `GET /api/products` excludes them.
5. **Category delete guard**: `DELETE /api/categories/:id` must check that no products reference the category before deleting.
