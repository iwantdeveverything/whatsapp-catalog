import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("API_CONTRACT.md", () => {
  const contractPath = path.resolve(
    __dirname,
    "../../lib/services/API_CONTRACT.md",
  );

  it("file exists", () => {
    expect(fs.existsSync(contractPath)).toBe(true);
  });

  it("documents all 13 endpoints", () => {
    const content = fs.readFileSync(contractPath, "utf-8");

    // Count endpoint definitions (lines starting with `### ` followed by optional number + method+path)
    const endpointHeaders = content.match(/^###\s+(?:\d+\.\d+\s+)?(?:GET|POST|PUT|DELETE)\s+\/api\//gm);
    expect(endpointHeaders).not.toBeNull();
    expect(endpointHeaders!.length).toBe(13);
  });

  it("documents Auth: POST /api/auth/login", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    expect(content).toContain("POST /api/auth/login");
  });

  it("documents Products: GET, GET/:id, POST, PUT/:id, DELETE/:id", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    expect(content).toMatch(/GET\s+\/api\/products\b/);
    expect(content).toMatch(/GET\s+\/api\/products\/:id/);
    expect(content).toMatch(/POST\s+\/api\/products\b/);
    expect(content).toMatch(/PUT\s+\/api\/products\/:id/);
    expect(content).toMatch(/DELETE\s+\/api\/products\/:id/);
  });

  it("documents Categories: GET, GET/:id, POST, PUT/:id, DELETE/:id", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    expect(content).toMatch(/GET\s+\/api\/categories\b/);
    expect(content).toMatch(/GET\s+\/api\/categories\/:id/);
    expect(content).toMatch(/POST\s+\/api\/categories\b/);
    expect(content).toMatch(/PUT\s+\/api\/categories\/:id/);
    expect(content).toMatch(/DELETE\s+\/api\/categories\/:id/);
  });

  it("documents Settings: GET, PUT", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    expect(content).toMatch(/GET\s+\/api\/settings\b/);
    expect(content).toMatch(/PUT\s+\/api\/settings\b/);
  });

  it("includes request body Zod shapes for POST/PUT endpoints", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    // Should contain schema field references
    expect(content).toContain("LoginSchema");
    expect(content).toContain("ProductFormSchema");
    expect(content).toContain("CategoryFormSchema");
    expect(content).toContain("SettingsSchema");
  });

  it("includes response body shapes", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    // Response shapes should be described
    expect(content).toContain("Response");
    expect(content).toContain("Product");
    expect(content).toContain("Category");
    expect(content).toContain("AuthResult");
  });

  it("is self-contained — a backend dev can implement from it", () => {
    const content = fs.readFileSync(contractPath, "utf-8");
    // Should have a section explaining how to use
    expect(content.toLowerCase()).toContain("implement");
  });
});
