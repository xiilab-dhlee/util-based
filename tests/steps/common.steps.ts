import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { test } from "../fixtures";
import { setupAllMocks } from "../support/mocks";

/**
 * 공통 Step Definitions
 *
 * 여러 도메인에서 공통으로 사용되는 Step 정의
 * - 인증 관련
 * - 워크스페이스 관련
 * - URL 검증
 * - 목록 페이지 공통
 * - 탭 관련
 *
 * Page Objects:
 * - workloadListPage: 워크로드 목록 페이지
 * - workloadDetailPage: 워크로드 상세 페이지
 * - monitoringPage: 모니터링 페이지
 * - modal: 모달 조작
 * - drawer: 드로어 조작
 */

const { Given, When, Then } = createBdd(test);

// ============================================
// 인증 관련 Steps
// ============================================

/**
 * 사용자 인증 Step
 *
 * globalSetup에서 storageState로 인증 상태가 저장되어 있고,
 * playwright.config.ts에서 자동으로 로드됩니다.
 *
 * 이 Step에서는 API Mock 설정만 수행합니다.
 * 인증 쿠키는 Playwright가 자동으로 관리합니다.
 */
Given("사용자가 로그인되어 있다", async ({ page }) => {
  await setupAllMocks(page);
});

// ============================================
// 페이지 위치 관련 Steps
// ============================================

Given("모니터링 페이지에 있다", async ({ monitoringPage }) => {
  await monitoringPage.goto();
});

Given("활성화 워크로드 목록 페이지에 있다", async ({ workloadListPage }) => {
  await workloadListPage.goto();
});

Given("비활성화 워크로드 목록 페이지에 있다", async ({ workloadListPage }) => {
  await workloadListPage.gotoDisabled();
});

Given(
  "워크로드 상세 페이지에 있다",
  async ({ workloadDetailPage, workloadId, workspaceId }) => {
    await workloadDetailPage.gotoWorkload(workloadId, workspaceId);
  },
);

// ============================================
// 워크스페이스 관련 Steps
// ============================================

Given("워크스페이스가 선택되어 있다", async ({ page, assertLogger }) => {
  const workspaceSelectValue = page.locator(
    testId(SELECTOR.WORKSPACE_SELECT_VALUE),
  );
  await expect(workspaceSelectValue).toBeVisible({ timeout: 10000 });

  const workspaceText = await workspaceSelectValue.textContent();
  assertLogger.assertNotEmpty("워크스페이스", workspaceText);
});

// ============================================
// URL 관련 Steps
// ============================================

Then("URL이 {string}를 포함한다", async ({ page }, expectedUrl: string) => {
  const regexPattern = expectedUrl
    .replace(/\[[\w]+\]/g, "[\\w-]+")
    .replace(/\//g, "\\/")
    .replace(/\?/g, "\\?");

  await expect(page).toHaveURL(new RegExp(regexPattern));
});

Then("URL이 {string}와 일치한다", async ({ page }, expectedUrl: string) => {
  const regexPattern = expectedUrl
    .replace(/\[[\w]+\]/g, "[\\w-]+")
    .replace(/\//g, "\\/");

  await expect(page).toHaveURL(new RegExp(`${regexPattern}(\\?.*)?$`));
});

Then(
  "네비게이션 메뉴 중 {string} 메뉴가 활성화되어 있다",
  async ({ page }, menuName: string) => {
    const selectedMenu = page.locator(
      ".ant-menu-item-selected .ant-menu-title-content",
    );
    await expect(selectedMenu).toBeVisible({ timeout: 10000 });
    await expect(selectedMenu).toHaveText(menuName);
  },
);

// ============================================
// 목록 페이지 공통 Steps
// ============================================

Then("목록 테이블이 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertTableVisible();
});

Then(
  "목록에 총 개수가 표시된다",
  async ({ workloadListPage, assertLogger }) => {
    const text = await workloadListPage.getTotalCountText();
    assertLogger.assertMatch("총 개수 형식", text, /총\s*\d+/);
  },
);

Then("페이지네이션이 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertPaginationVisible();
});

Then("검색창이 빈 값으로 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertSearchInputEmpty();
});

// ============================================
// 탭 관련 Steps
// ============================================

Then("{string} 탭이 선택되어 있다", async ({ tabs }, tabName: string) => {
  await tabs.assertActiveTab(tabName);
});

Then("{string} 탭이 활성화되어 있다", async ({ tabs }, tabName: string) => {
  await tabs.assertTabEnabled(tabName);
});

Then("{string} 탭이 비활성화되어 있다", async ({ tabs }, tabName: string) => {
  await tabs.assertTabDisabled(tabName);
});

When(
  "{string} 탭을 클릭하여 {string} 페이지로 이동한다",
  async ({ tabs }, tabName: string, _pageName: string) => {
    await tabs.clickTab(tabName);
  },
);

// ============================================
// 모달 관련 Steps
// ============================================

Then("확인 모달이 표시된다", async ({ modal }) => {
  await modal.waitForVisible();
});

Then("확인 모달이 닫힌다", async ({ modal }) => {
  await modal.waitForHidden();
});

When("확인 모달의 확인 버튼을 클릭한다", async ({ modal }) => {
  await modal.clickOk();
});

When("확인 모달의 취소 버튼을 클릭한다", async ({ modal }) => {
  await modal.clickCancel();
});

// ============================================
// 드로어 관련 Steps
// ============================================

Then("{string} 드로어가 표시된다", async ({ drawer }, drawerTitle: string) => {
  await drawer.waitForVisible();
  await drawer.assertTitle(drawerTitle);
});

Then("드로어가 닫힌다", async ({ drawer }) => {
  await drawer.waitForHidden();
});

When(
  /^드로어의 "(취소|이전 단계)" 버튼을 클릭한다$/,
  async ({ drawer }, buttonText: string) => {
    await drawer.clickButton(buttonText);
  },
);

// ============================================
// Step 진행 상태 (공통)
// ============================================

/** Step 번호와 조상 클래스 매핑 */
const STEP_CLASS_MAP: Record<number, string> = {
  1: "first-step",
  2: "middle-step",
  3: "middle-step",
  4: "last-step",
};

/** Step 번호와 텍스트 매핑 */
const STEP_TEXT_MAP: Record<number, string> = {
  1: "01",
  2: "02",
  3: "03",
  4: "04",
};

Then(/^현재 Step이 (\d+)이다$/, async ({ page }, stepNum: number) => {
  const stepClass = STEP_CLASS_MAP[stepNum];
  const stepText = STEP_TEXT_MAP[stepNum];

  // 조상에 active와 step-class가 공존하고, step-title에 해당 텍스트가 있는지 확인
  const activeStep = page.locator(
    `.${stepClass}.active .step-title:text("${stepText}")`,
  );
  await expect(activeStep).toBeVisible({ timeout: 10000 });
});
