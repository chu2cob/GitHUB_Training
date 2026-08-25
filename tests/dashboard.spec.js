import { test, expect } from '@playwright/test';

// Playwright E2E coverage for the live telemetry dashboard.
// This checks the real user-visible behavior and stores artifacts that serve as evidence.

test.describe('Vehicle Telemetry Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Users/chu2cob/Desktop/Training/Day1/index.html');
  });

async function attachEvidence(page, testInfo, suffix) {
  const image = await page.screenshot({
    path: `test-results/${testInfo.title.replace(/\s+/g, '-')}-${suffix}.png`,
    fullPage: true
  });

  await testInfo.attach(`${suffix}-screenshot`, {
    body: image,
    contentType: 'image/png'
  });

  const video = page.video();
  if (video) {
    await testInfo.attach(`${suffix}-video`, {
      path: await video.path(),
      contentType: 'video/webm'
    });
  }
}

test.describe('Vehicle Telemetry Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Users/chu2cob/Desktop/Training/Day1/index.html');
  });

  test('dashboard loads with a visible fleet and telemetry values', async ({ page }, testInfo) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('#speedValue')).not.toHaveText('0');
    await expect(page.locator('#rpmValue')).not.toHaveText('0');
    await expect(page.locator('.fleet-item')).toHaveCount(4);

    await attachEvidence(page, testInfo, 'dashboard');
  });

  test('vehicle selection updates the active dashboard state', async ({ page }, testInfo) => {
    const secondVehicle = page.locator('.fleet-item').nth(1);
    await secondVehicle.click();
    await expect(page.locator('#headerVehicleName')).toContainText('Discovery 02');

    await attachEvidence(page, testInfo, 'selection');
  });

  test('live telemetry values change over time', async ({ page }, testInfo) => {
    const before = await page.locator('#speedValue').textContent();
    await page.waitForTimeout(2500);
    const after = await page.locator('#speedValue').textContent();
    expect(before).not.toBe(after);

    await attachEvidence(page, testInfo, 'live-update');
  });

  test('theme and unit toggles respond without crashing', async ({ page }, testInfo) => {
    await page.locator('#themeToggle').click();
    await page.locator('#unitToggle').click();
    await expect(page.locator('#speedUnit')).toContainText('mph');

    await attachEvidence(page, testInfo, 'toggle');
  });
});
