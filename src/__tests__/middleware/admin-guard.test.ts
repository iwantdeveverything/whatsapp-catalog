import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

function makeRequest(path: string, cookies?: Record<string, string>) {
  const url = new URL(path, "http://localhost:3000");
  const request = new NextRequest(url);

  if (cookies) {
    for (const [key, value] of Object.entries(cookies)) {
      request.cookies.set(key, value);
    }
  }

  return request;
}

describe("middleware admin guard", () => {
  it("redirects to /login when accessing /admin/dashboard without admin-token", () => {
    const req = makeRequest("/admin/dashboard");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("redirects to /login when accessing /admin/products without admin-token", () => {
    const req = makeRequest("/admin/products");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("allows /admin/dashboard with valid admin-token cookie", () => {
    const req = makeRequest("/admin/dashboard", { "admin-token": "mock-jwt-token" });
    const res = middleware(req);

    expect(res.status).not.toBe(307);
  });

  it("allows /admin/products with valid admin-token cookie", () => {
    const req = makeRequest("/admin/products", { "admin-token": "mock-jwt-token" });
    const res = middleware(req);

    expect(res.status).not.toBe(307);
  });

  it("allows /login without admin-token", () => {
    const req = makeRequest("/login");
    const res = middleware(req);

    expect(res.status).not.toBe(307);
  });

  it("allows non-admin routes without admin-token", () => {
    const req = makeRequest("/");
    const res = middleware(req);

    expect(res.status).not.toBe(307);
  });

  it("redirects /admin/settings without admin-token", () => {
    const req = makeRequest("/admin/settings");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("preserves existing theme cookie logic after admin check", () => {
    // The resolved theme is forwarded UPSTREAM to Server Components as
    // `x-middleware-request-x-theme`, not as a client-facing response header.
    const req = makeRequest("/admin/dashboard", { "admin-token": "mock-jwt-token" });
    req.headers.set("cookie", "theme=nike");
    const res = middleware(req);

    expect(res.headers.get("x-middleware-request-x-theme")).toBe("nike");
  });

  it("forces luxury theme for non-admin routes", () => {
    const req = makeRequest("/");
    req.headers.set("cookie", "theme=shopify"); // Even if cookie is shopify, should force luxury
    const res = middleware(req);

    expect(res.headers.get("x-middleware-request-x-theme")).toBe("luxury");
  });
});