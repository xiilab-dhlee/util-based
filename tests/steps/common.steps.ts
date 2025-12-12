import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { test } from "../fixtures";
import { authenticate } from "../support/auth.helper";
import { setupAllMocks } from "../support/mocks";

const { Given, When, Then } = createBdd(test);

/**
 * 공통 Step Definitions
 *
 * 여러 도메인에서 공통으로 사용되는 Step 정의
 * - 인증 관련
 * - 워크스페이스 관련
 * - URL 검증
 * - 목록 페이지 공통
 * - 탭 관련
 */

// ============================================
// 인증 관련 Steps
// ============================================

Given("사용자가 로그인되어 있다", async ({ page }) => {
  await setupAllMocks(page);
  await authenticate(page, "user");
});

// ============================================
// 페이지 위치 관련 Steps
// ============================================

Given("모니터링 페이지에 있다", async ({ page }) => {
  await page.goto("/user/monitoring");
  await page.waitForLoadState("networkidle");
});

Given("활성화 워크로드 목록 페이지에 있다", async ({ page }) => {
  await page.goto("/user/workload");
  await page.waitForLoadState("networkidle");
});

Given("비활성화 워크로드 목록 페이지에 있다", async ({ page }) => {
  await page.goto("/user/workload/disabled");
  await page.waitForLoadState("networkidle");
});

Given(
  "워크로드 상세 페이지에 있다",
  async ({ page, workloadId, workspaceId }) => {
    await page.goto(`/user/workload/${workloadId}?workspaceId=${workspaceId}`);
    await page.waitForLoadState("networkidle");
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

Then("목록 테이블이 표시된다", async ({ page }) => {
  const table = page.locator(testId(SELECTOR.LIST_TABLE));
  await expect(table).toBeVisible({ timeout: 10000 });
});

Then("목록에 총 개수가 표시된다", async ({ page, assertLogger }) => {
  const totalCount = page.locator(testId(SELECTOR.LIST_TOTAL_COUNT));
  await expect(totalCount).toBeVisible({ timeout: 10000 });

  const text = (await totalCount.textContent()) ?? "";
  assertLogger.assertMatch("총 개수 형식", text, /총\s*\d+/);
});

Then("페이지네이션이 표시된다", async ({ page }) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  await expect(pagination).toBeVisible({ timeout: 10000 });
});

Then("검색창이 빈 값으로 표시된다", async ({ page }) => {
  const searchInput = page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await expect(searchInput).toHaveValue("");
});

// ============================================
// 페이지네이션 관련 Steps
// ============================================

Then(/^현재 페이지가 (\d+)이다$/, async ({ page }, pageNum: number) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  const activePageLink = pagination.locator(".ant-pagination-item-active a");
  await expect(activePageLink).toHaveText(String(pageNum));
});

Given(/^페이지 (\d+)로 이동한 상태이다$/, async ({ page }, pageNum: string) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  const targetPageItem = pagination.locator(`.ant-pagination-item-${pageNum}`);

  // 이미 해당 페이지면 스킵
  const isActive = await targetPageItem.evaluate((el) =>
    el.classList.contains("ant-pagination-item-active"),
  );
  if (isActive) return;

  // 해당 페이지로 이동 (a 태그 클릭)
  await targetPageItem.locator("a").click();
  await expect(targetPageItem).toHaveClass(/ant-pagination-item-active/);
});

Given(
  /^총 페이지가 (\d+) 이상이다$/,
  async ({ page, $testInfo }, minPages: string) => {
    const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
    const pageItems = pagination.locator(".ant-pagination-item");
    const count = await pageItems.count();

    if (count < parseInt(minPages, 10)) {
      $testInfo.skip(
        true,
        `총 페이지가 ${minPages} 미만이어서 시나리오를 스킵합니다`,
      );
    }
  },
);

When("다음 페이지 버튼을 클릭한다", async ({ page }) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  const currentActive = pagination.locator(".ant-pagination-item-active");
  const currentPage = await currentActive.getAttribute("title");

  const nextButton = pagination.locator(".ant-pagination-next");
  await nextButton.click();

  // 현재 페이지가 active에서 해제될 때까지 대기
  await expect(
    pagination.locator(`.ant-pagination-item-${currentPage}`),
  ).not.toHaveClass(/ant-pagination-item-active/);
});

When("이전 페이지 버튼을 클릭한다", async ({ page }) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  const currentActive = pagination.locator(".ant-pagination-item-active");
  const currentPage = await currentActive.getAttribute("title");

  const prevButton = pagination.locator(".ant-pagination-prev");
  await prevButton.click();

  // 현재 페이지가 active에서 해제될 때까지 대기
  await expect(
    pagination.locator(`.ant-pagination-item-${currentPage}`),
  ).not.toHaveClass(/ant-pagination-item-active/);
});

When(/^페이지 (\d+)을 클릭한다$/, async ({ page }, pageNum: string) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  const targetPageItem = pagination.locator(`.ant-pagination-item-${pageNum}`);
  await targetPageItem.locator("a").click();
  await expect(targetPageItem).toHaveClass(/ant-pagination-item-active/);
});

// ============================================
// 탭 관련 Steps
// ============================================

Then("{string} 탭이 선택되어 있다", async ({ page }, tabName: string) => {
  const activeTab = page.locator(".tabs-nav .tab-item.active .tab-label");
  await expect(activeTab).toBeVisible();
  await expect(activeTab).toHaveText(tabName);
});

Then("{string} 탭이 비활성화되어 있다", async ({ page }, tabName: string) => {
  // :text()는 정확히 일치, :has-text()는 부분 일치
  const disabledTab = page.locator(
    `.tabs-nav .tab-item.disabled .tab-label:text("${tabName}")`,
  );
  await expect(disabledTab).toBeVisible({ timeout: 10000 });
});

When(
  "{string} 탭을 클릭하여 {string} 페이지로 이동한다",
  async ({ page }, tabName: string, _pageName: string) => {
    // :text-is()는 정확히 일치 (공백 정규화 포함)
    // "활성화"와 "비활성화" 구분을 위해 사용
    const tab = page.locator(
      `.tabs-nav .tab-item .tab-label:text-is("${tabName}")`,
    );
    await expect(tab).toBeVisible({ timeout: 10000 });
    await tab.click();
    await page.waitForLoadState("networkidle");
  },
);

// ============================================
// 모달 관련 Steps
// ============================================

Then("확인 모달이 표시된다", async ({ page }) => {
  // 모달 컨테이너가 visible 상태인지 확인
  const modal = page.locator(SELECTOR.MODAL);
  await expect(modal).toBeVisible({ timeout: 10000 });

  // 모달 콘텐츠가 완전히 렌더링될 때까지 대기 (애니메이션 완료)
  const modalContent = modal.locator(".ant-modal-content");
  await expect(modalContent).toBeVisible({ timeout: 10000 });

  // 모달 애니메이션 완료 대기 (스크린샷 캡처용)
  await page.waitForTimeout(200);
});

Then("확인 모달이 닫힌다", async ({ page }) => {
  const modal = page.locator(SELECTOR.MODAL);
  await expect(modal).not.toBeVisible({ timeout: 10000 });
});

When("확인 모달의 확인 버튼을 클릭한다", async ({ page }) => {
  const okButton = page.locator(SELECTOR.MODAL_OK_BUTTON);
  await expect(okButton).toBeVisible();
  await okButton.click();
});

When("확인 모달의 취소 버튼을 클릭한다", async ({ page }) => {
  const cancelButton = page.locator(SELECTOR.MODAL_CANCEL_BUTTON);
  await expect(cancelButton).toBeVisible();
  await cancelButton.click();
});

// ============================================
// 드로어 관련 Steps
// ============================================

Then("{string} 드로어가 표시된다", async ({ page }, drawerTitle: string) => {
  const drawer = page.locator(SELECTOR.DRAWER);
  await expect(drawer).toBeVisible({ timeout: 10000 });

  // 드로어 제목 확인
  const title = drawer.locator(".ant-drawer-title");
  await expect(title).toContainText(drawerTitle);

  // 드로어 애니메이션 완료 대기
  await page.waitForTimeout(200);
});

Then("드로어가 닫힌다", async ({ page }) => {
  const drawer = page.locator(SELECTOR.DRAWER);
  await expect(drawer).toBeHidden({ timeout: 10000 });
});

When(
  /^드로어의 "(취소|이전 단계)" 버튼을 클릭한다$/,
  async ({ page }, buttonText: string) => {
    const drawer = page.locator(SELECTOR.DRAWER);
    const button = drawer.getByRole("button", { name: buttonText });
    await button.click();
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
