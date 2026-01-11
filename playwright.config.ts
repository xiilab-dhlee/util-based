import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  paths: ["tests/features/**/*.feature"], // feature 파일 위치
  require: [
    "tests/fixtures.ts", // 커스텀 fixture (먼저 로드)
    "tests/support/**/*.ts",
    "tests/steps/**/*.ts",
  ],
});

// CI 환경 여부
const isCI = !!process.env.CI;

// 테스트 모드: mock (기본) | integration (실제 API)
const isIntegration = process.env.TEST_MODE === "integration";

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir, // BDD 설정에서 생성된 testDir 사용

  /* 전역 설정 - 테스트 시작 전 1회 실행 (테스트 데이터 초기화 등) */
  globalSetup: require.resolve("./tests/global-setup"),

  /* 병렬 실행 설정 */
  fullyParallel: true,

  /* CI 환경에서만 실패 시 재시도 */
  retries: isCI ? 2 : 0,

  /* Worker 설정: CI는 CPU 코어의 50%, 로컬은 1 */
  workers: isCI ? "50%" : 2,

  /* 리포터 설정 */
  reporter: [
    ["list"],
    ["html", { outputFolder: "tests/reports/playwright-html", open: "never" }],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        suiteTitle: true, // Feature 이름을 Suite로 표시
        detail: true, // Step 상세 정보 포함
        categories: [
          // 실패 분류
          {
            name: "Timeout errors",
            matchedStatuses: ["broken"],
            messageRegex: ".*Timeout.*",
          },
          {
            name: "Element not found",
            matchedStatuses: ["broken"],
            messageRegex: ".*locator.*",
          },
        ],
      },
    ],
  ],

  /* 모든 테스트에 공통으로 적용되는 설정 */
  use: {
    /* 실패 시 스크린샷 캡처 */
    screenshot: "only-on-failure",

    /* 실패 시 trace 기록 */
    trace: "retain-on-failure",

    /* 비디오 녹화 설정 */
    // video: "retain-on-failure",

    /* Base URL - 개발 서버 주소 */
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    /* 네비게이션 타임아웃 (최적화: 30초 → 20초) */
    navigationTimeout: 20000,

    /* 액션 타임아웃 (최적화: 15초 → 10초) */
    actionTimeout: 10000,
  },

  /* 프로젝트별 설정 */
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
  ],

  /* 테스트 실행 전 서버 자동 시작 */
  webServer: {
    // integration 모드: 빌드된 앱 실행 (pnpm start)
    // mock 모드: 개발 서버 실행 (pnpm dev:test)
    command: isIntegration ? "pnpm start" : "pnpm dev:test",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: isIntegration ? 60 * 1000 : 30 * 1000, // integration 모드는 빌드 후 시작이므로 타임아웃 증가
  },

  /* 테스트 타임아웃 설정 */
  timeout: 20000,

  /* 각 테스트의 expect 타임아웃 */
  expect: {
    timeout: 5000,
  },
});
