import { test, expect } from "@playwright/test";
for (const [name, width, height] of [
  ["small", 320, 568],
  ["large", 430, 932],
  ["desktop", 1440, 900],
] as const) {
  test(`${name}: cover, seal and invitation`, async ({ page, context }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveTitle("Casamento de Philipe & Vanessa");
    await expect(
      page.getByRole("heading", { name: "Philipe & Vanessa" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `/tmp/wedding-${name}.png`, fullPage: true });
    const seal = page.getByRole("button", { name: "Abrir convite" });
    await seal.focus();
    await page.keyboard.press("Enter");
    await expect(seal).toBeDisabled();
    await expect(page).toHaveURL(/\/convite$/);
    expect(context.pages()).toHaveLength(1);
    await expect(
      page.getByRole("heading", { name: "O grande dia" }),
    ).toBeVisible();
    expect(
      await page
        .locator("img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/wedding-inside-${name}.png`,
      fullPage: true,
    });
    await page.getByRole("link", { name: "Voltar à capa" }).click();
    await page.getByRole("link", { name: "Pular abertura" }).click();
    await expect(page).toHaveURL(/\/convite$/);
    await page.reload();
    await expect(
      page.getByText("Sua presença fará parte da nossa história."),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test("reduced motion and short viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 420 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight > innerHeight,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Abrir convite" }).click();
  await expect(page).toHaveURL(/\/convite$/);
});
