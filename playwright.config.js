import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  outputDir: 'test-results',
  use: {
    headless: true,
    browserName: 'chromium',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    launchOptions: {
      args: ['--disable-dev-shm-usage']
    }
  }
});
