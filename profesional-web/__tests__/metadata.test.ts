import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

describe("SEO metadata", () => {
  it("exposes the expected long-tail keywords", () => {
    const keywords = Array.isArray(metadata.keywords) ? metadata.keywords : [];
    const expectedKeywords = [
      "consultor cloud ROI",
      "reducir costes AWS",
      "automatización procesos industriales",
      "optimización factura Azure",
      "auditoría cloud 48 horas",
      "consultor DevOps España",
      "reducción costes cloud payback",
    ];

    expect(keywords).toEqual(expectedKeywords);
  });

  it("keeps the main title under 70 characters for SERP", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title && typeof metadata.title === "object" && "default" in metadata.title ? metadata.title.default : undefined);
    expect(title).toBeDefined();
    expect(title!.length).toBeLessThanOrEqual(70);
  });

  it("keeps the description between 120 and 160 characters", () => {
    const description = typeof metadata.description === "string" ? metadata.description : "";
    expect(description.length).toBeGreaterThanOrEqual(120);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("points metadataBase to https://fjgaparicio.es", () => {
    const base = metadata.metadataBase?.toString();
    expect(base).toBeTruthy();
    expect(base!.startsWith("https://fjgaparicio.es")).toBe(true);
  });
});
