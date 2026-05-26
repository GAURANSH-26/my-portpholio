import { expect, test } from "@playwright/test";

test.describe("portfolio visual smoke", () => {
  test("hero renders with WebGL, copy, and CTA", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /gauransh/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /start on whatsapp/i })).toBeVisible();

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    const bounds = await canvas.boundingBox();
    expect(bounds?.width).toBeGreaterThan(300);
    expect(bounds?.height).toBeGreaterThan(500);

    const dataUrlLength = await canvas.evaluate((node) =>
      (node as HTMLCanvasElement).toDataURL("image/png").length
    );
    expect(dataUrlLength).toBeGreaterThan(12_000);

    await page.screenshot({
      path: `test-results/${testInfo.project.name}-hero.png`,
      fullPage: false,
      animations: "disabled"
    });
  });

  test("reduced-motion fallback removes the WebGL canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".hero-canvas--static img")).toBeVisible();
    await expect(page.getByRole("link", { name: /start on whatsapp/i })).toBeVisible();
  });
});
