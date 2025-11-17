import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  paths: ["tests/features/**/*.feature"], // feature 파일 위치
  require: ["tests/support/**/*.ts", "tests/steps/**/*.ts"], // hooks와 step definitions 위치
});

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir, // BDD 설정에서 생성된 testDir 사용

  /* 병렬 실행 설정 */
  fullyParallel: false,

  /* CI 환경에서만 실패 시 재시도 */
  retries: process.env.CI ? 2 : 0,

  /* CI에서는 병렬 처리 비활성화 */
  workers: process.env.CI ? 1 : undefined,

  /* 리포터 설정 */
  reporter: [
    // ["html", { outputFolder: "tests/reports/playwright-html" }],
    // ["json", { outputFile: "tests/reports/playwright-json/results.json" }],
    ["list"],
  ],

  /* 모든 테스트에 공통으로 적용되는 설정 */
  use: {
    /* 실패 시 스크린샷 캡처 */
    screenshot: "only-on-failure",

    /* 실패 시 trace 기록 */
    trace: "retain-on-failure",

    /* 비디오 녹화 설정 */
    video: "retain-on-failure",

    /* Base URL - 개발 서버 주소 */
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    /* 네비게이션 타임아웃 */
    navigationTimeout: 30000,

    /* 액션 타임아웃 */
    actionTimeout: 15000,
  },

  /* 프로젝트별 설정 - 다양한 브라우저에서 테스트 */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 }
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 }
    //   },
    // },

    /* 모바일 뷰포트 테스트 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* 테스트 실행 전 개발 서버 자동 시작 */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
