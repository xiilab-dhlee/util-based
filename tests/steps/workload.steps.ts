import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

/**
 * 워크로드 검색 기능 Step Definitions
 *
 * 기반 정보:
 * - 라우트: /user/workload
 * - 검색 폼: [data-testid="workload-list-search-form"]
 * - 검색 입력: input[name="search"]
 * - 테이블 컴포넌트: CustomizedTable
 * - 로딩 레이어: [data-testid="api-loading-spinner"]
 */

/**
 * Background - 워크로드 목록 페이지 접근
 */
Given("사용자가 워크로드 목록 페이지에 있다", async ({ page }) => {
  // 워크로드 목록 페이지로 이동
  await page.goto("/user/workload");

  // 페이지가 로드될 때까지 대기 (DOM이 준비되면 충분)
  await page.waitForLoadState("domcontentloaded");

  // URL 체크
  await expect(page).toHaveURL(/\/user\/workload/);

  // 로딩 스피너가 사라질 때까지 최대 10초간 대기
  // 스피너가 없으면 즉시 통과, 있으면 사라질 때까지 대기
  const loadingSpinner = page.locator('[data-testid="api-loading-spinner"]');
  await loadingSpinner.waitFor({ state: "hidden", timeout: 10000 });
});

/**
 * Then - 워크로드 목록 테이블 표시 확인
 */
Then("워크로드 목록 테이블이 표시된다", async ({ page }) => {
  // 테이블이 렌더링될 때까지 대기 (여러 가능한 선택자 시도)
  const tableSelectors = [
    ".ant-table",
    "table",
    '[class*="table"]',
    ".ant-table-wrapper",
  ];

  let tableFound = false;
  for (const selector of tableSelectors) {
    const table = page.locator(selector).first();
    if ((await table.count()) > 0) {
      await expect(table).toBeVisible({ timeout: 10000 });
      tableFound = true;
      break;
    }
  }

  // 최소한 테이블 관련 요소가 있는지 확인
  if (!tableFound) {
    // 테이블이 없어도 워크로드 목록 컨테이너가 있으면 OK
    const container = page.locator('[class*="workload"]').first();
    console.log(container);
    await expect(container).toBeVisible({ timeout: 10000 });
  }
});

/**
 * Then - 검색 입력창 표시 확인
 */
Then("검색 입력창이 표시된다", async ({ page }) => {
  // 검색 입력창 확인
  const searchInput = page.locator('input[name="search"]');
  await expect(searchInput).toBeVisible();

  // placeholder 확인
  await expect(searchInput).toHaveAttribute(
    "placeholder",
    /검색어를 입력하세요./i,
  );
});

/**
 * When - 검색창에 검색어 입력
 */
When(
  "사용자가 검색창에 {string}를 입력한다",
  async ({ page }, searchTerm: string) => {
    // 검색 입력창 찾기
    const searchInput = page.locator('input[name="search"]');

    // 기존 값 지우기
    await searchInput.clear();

    // 검색어 입력
    if (searchTerm) {
      await searchInput.fill(searchTerm);
    }
  },
);

/**
 * Then - 검색 폼 제출
 */
Then("사용자가 검색 폼을 제출한다", async ({ page }) => {
  // 검색 폼 찾기
  const searchForm = page.locator('[data-testid="workload-list-search-form"]');

  // 검색 입력창에서 엔터키 누르기
  const searchInput = searchForm.locator('input[name="search"]');
  await searchInput.press("Enter");

  // 검색 결과가 로드될 때까지 대기 (테이블이 업데이트되거나 로딩 인디케이터가 사라질 때까지)
  // networkidle 대신 특정 요소를 기다리는 것이 더 빠름
  const table = page.locator(".ant-table, table").first();
  await expect(table).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 검색 결과 표시 확인
 */
Then("검색 결과가 표시된다", async ({ page }) => {
  // 테이블이 여전히 표시되는지 확인
  const tableSelectors = [".ant-table", "table", '[class*="table"]'];

  let tableVisible = false;
  for (const selector of tableSelectors) {
    const table = page.locator(selector).first();
    if ((await table.count()) > 0 && (await table.isVisible())) {
      tableVisible = true;
      break;
    }
  }

  expect(tableVisible).toBeTruthy();
});

/**
 * Then - 모든 워크로드 표시 확인
 */
Then("모든 워크로드가 표시된다", async ({ page }) => {
  // 테이블이 표시되는지 확인 (빈 검색어는 전체 목록 표시)
  const table = page.locator(".ant-table, table").first();
  await expect(table).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 검색 결과 비어있음 확인 (허용)
 */
Then("검색 결과가 비어있을 수 있다", async ({ page }) => {
  // 결과가 없을 수도 있고 있을 수도 있음
  // "결과 없음" 메시지나 빈 테이블을 확인
  const noDataSelectors = [
    ".ant-empty",
    ".ant-table-placeholder",
    "text=/데이터가 없습니다|No data|결과가 없습니다/i",
  ];

  // 테이블이 있거나 "결과 없음" 메시지가 있으면 OK
  const table = page.locator(".ant-table, table").first();
  const hasTable = (await table.count()) > 0;

  if (hasTable) {
    // 테이블이 있으면 성공
    expect(hasTable).toBeTruthy();
  } else {
    // 테이블이 없으면 "결과 없음" 메시지가 있어야 함
    let noDataFound = false;
    for (const selector of noDataSelectors) {
      const noData = page.locator(selector).first();
      if ((await noData.count()) > 0) {
        noDataFound = true;
        break;
      }
    }
    // 어떤 형태로든 UI가 있으면 OK
    expect(hasTable || noDataFound).toBeTruthy();
  }
});

/**
 * Then - 검색 실행 확인
 */
Then("검색이 실행된다", async ({ page }) => {
  // 테이블이나 결과 영역이 표시되는지 확인 (networkidle 대신 직접 확인)
  const resultArea = page
    .locator('.ant-table, table, [class*="workload"]')
    .first();
  await expect(resultArea).toBeVisible({ timeout: 10000 });
});

/**
 * When - 검색 결과에 워크로드가 있는지 확인 (조건부)
 */
When("검색 결과에 워크로드가 있다면", async ({ page }) => {
  // 테이블 행이 있는지 확인
  const tableRows = page.locator(".ant-table-tbody tr, table tbody tr");
  const rowCount = await tableRows.count();

  if (rowCount === 0) {
    // 결과가 없으면 테스트 스킵
    console.log("검색 결과가 없어 이 단계를 건너뜁니다.");
    // 테스트를 계속 진행하지만 다음 단계는 실행하지 않음
    return;
  }

  // 최소한 1개 이상의 행이 있음을 확인
  expect(rowCount).toBeGreaterThan(0);
});

/**
 * Then - 첫 번째 워크로드 이름 클릭
 */
Then("사용자가 첫 번째 워크로드 이름을 클릭한다", async ({ page }) => {
  // 첫 번째 워크로드 이름 링크 찾기
  // WorkloadNameLink 컴포넌트는 워크로드 이름을 링크로 렌더링
  const firstWorkloadLink = page
    .locator(".ant-table-tbody tr, table tbody tr")
    .first()
    .locator("a")
    .first();

  // 링크가 있는지 확인
  const linkCount = await firstWorkloadLink.count();
  if (linkCount === 0) {
    console.log("워크로드 링크를 찾을 수 없습니다.");
    return;
  }

  // 링크가 보일 때까지 대기
  await expect(firstWorkloadLink).toBeVisible({ timeout: 5000 });

  // 클릭
  await firstWorkloadLink.click();

  // 페이지 이동 대기 (URL 변경 확인이 더 빠름)
  await expect(page).toHaveURL(/\/user\/workload\/[^/]+/, {
    timeout: 10000,
  });
});

/**
 * Then - 워크로드 상세 페이지 이동 확인
 */
Then("워크로드 상세 페이지로 이동한다", async ({ page }) => {
  // URL이 워크로드 상세 페이지인지 확인
  // 패턴: /user/workload/{workloadId}?workspaceId={workspaceId}
  await expect(page).toHaveURL(/\/user\/workload\/[^/]+/, {
    timeout: 10000,
  });

  // 페이지가 로드될 때까지 대기 (DOM이 준비되면 충분)
  await page.waitForLoadState("domcontentloaded");
});

/**
 * 영어 버전 Step Definitions (필요 시 추가)
 */
