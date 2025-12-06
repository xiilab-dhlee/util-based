import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  clearAuthCookies,
  getSession,
  hasAuthCookie,
  isAuthenticated,
  loginAs,
} from "../support/auth.helper";

const { Given, When, Then } = createBdd();

/**
 * 사용자 모니터링 페이지 진입 Step Definitions
 *
 * 기반 정보:
 * - 라우트: /user/monitoring
 * - 인증 확인: NextAuth 세션 API (/api/auth/session)
 * - 페이지 컨테이너: [data-testid="user-monitoring-page"]
 * - 워크스페이스 선택값: [data-testid="workspace-select-value"]
 * - 리소스 그래프: [data-testid="user-monitoring-resource-graph"]
 * - 리소스 회수 정보: [data-testid="user-monitoring-resource-recovery"]
 * - 워크로드 정보: [data-testid="user-monitoring-workload-info"]
 * - 실행 중 워크로드 목록: [data-testid="user-monitoring-running-workload-list"]
 * - 리소스 회수 예정 워크로드 목록: [data-testid="user-monitoring-recovery-workload-list"]
 */

/**
 * Given - 로그인 상태 확인
 * NextAuth CredentialsProvider를 통해 실제 로그인 수행
 */
Given("사용자는 로그인 상태이다", async ({ page }) => {
  // NextAuth API를 통해 실제 로그인 수행 (admin 사용자)
  await loginAs(page.context(), "admin");

  // 세션 쿠키가 설정되었는지 확인
  const hasCookie = await hasAuthCookie(page);
  expect(hasCookie).toBeTruthy();

  // 세션 API를 통해 인증 상태 검증
  const authenticated = await isAuthenticated(page);
  expect(authenticated).toBeTruthy();

  // 세션 사용자 정보 확인 (디버깅용)
  const session = await getSession(page);
  expect(session).not.toBeNull();
  expect(session?.preferred_username).toBe("admin");
});

/**
 * Given - 워크스페이스 선택 상태 확인
 */
Given("워크스페이스가 선택되어 있다", async ({ page }) => {
  // WorkspaceSelect 컴포넌트의 Value 텍스트가 빈값이 아닌지 확인
  const workspaceSelectValue = page.locator(
    '[data-testid="workspace-select-value"]',
  );

  // 요소가 표시될 때까지 대기 (최대 10초)
  await expect(workspaceSelectValue).toBeVisible({ timeout: 10000 });

  // 워크스페이스 값이 빈값이 아닌지 확인
  const workspaceText = await workspaceSelectValue.textContent();
  expect(workspaceText).toBeTruthy();
  expect(workspaceText?.trim().length).toBeGreaterThan(0);
});

/**
 * When - 모니터링 페이지 진입
 */
When("사용자가 모니터링 페이지로 진입한다", async ({ page }) => {
  // 이미 Background에서 페이지에 접근했으므로 URL만 확인
  // 필요시 다시 이동
  const currentUrl = page.url();
  if (!currentUrl.includes("/user/monitoring")) {
    await page.goto("/user/monitoring");
    await page.waitForLoadState("domcontentloaded");
  }
});

/**
 * Then - 모니터링 페이지 표시 확인
 */
Then("모니터링 페이지가 표시된다", async ({ page }) => {
  // 모니터링 페이지 컨테이너 확인
  const monitoringPage = page.locator('[data-testid="user-monitoring-page"]');
  await expect(monitoringPage).toBeVisible({ timeout: 10000 });
});

/**
 * Then - URL 검증
 */
Then("URL이 {string}이다", async ({ page }, expectedUrl: string) => {
  await expect(page).toHaveURL(new RegExp(expectedUrl));
});

/**
 * Then - CPU 그래프 표시 확인
 */
Then("CPU 그래프가 표시된다", async ({ page }) => {
  // 리소스 그래프 영역 확인
  const resourceGraph = page.locator(
    '[data-testid="user-monitoring-resource-graph"]',
  );
  await expect(resourceGraph).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 리소스 회수 정보 표시 확인 (GPU/CPU/Memory 카드)
 */
Then("리소스 회수 정보가 표시된다", async ({ page }) => {
  // 리소스 회수 정보 영역 확인
  const resourceRecovery = page.locator(
    '[data-testid="user-monitoring-resource-recovery"]',
  );
  await expect(resourceRecovery).toBeVisible({ timeout: 10000 });

  // 워크로드 정보 영역 (GPU/CPU/MEM 카드 포함) 확인
  const workloadInfo = page.locator(
    '[data-testid="user-monitoring-workload-info"]',
  );
  await expect(workloadInfo).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 실행 중 워크로드 목록 표시 확인
 */
Then("실행 중 워크로드 목록이 표시된다", async ({ page }) => {
  // 실행 중 워크로드 목록 영역 확인
  const runningWorkloadList = page.locator(
    '[data-testid="user-monitoring-running-workload-list"]',
  );
  await expect(runningWorkloadList).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 리소스 회수 예정 워크로드 목록 표시 확인
 */
Then("리소스 회수 예정 워크로드 목록이 표시된다", async ({ page }) => {
  // 리소스 회수 예정 워크로드 목록 영역 확인
  const recoveryWorkloadList = page.locator(
    '[data-testid="user-monitoring-recovery-workload-list"]',
  );
  await expect(recoveryWorkloadList).toBeVisible({ timeout: 10000 });
});

/**
 * @skip 시나리오용 Step Definitions
 */

/**
 * Given - 로그인하지 않은 상태
 */
Given("사용자는 로그인하지 않은 상태이다", async ({ page }) => {
  // 모든 인증 쿠키 제거
  await clearAuthCookies(page.context());

  // 세션 쿠키가 없는지 확인
  const hasCookie = await hasAuthCookie(page);
  expect(hasCookie).toBeFalsy();

  // 세션 API로 인증 상태 확인
  const authenticated = await isAuthenticated(page);
  expect(authenticated).toBeFalsy();
});

/**
 * Then - 로그인 페이지 리다이렉트 확인
 */
Then("로그인 페이지로 리다이렉트된다", async ({ page }) => {
  // 로그인 페이지 URL 확인
  await expect(page).toHaveURL(/\/(login|signin|auth)/i, { timeout: 10000 });
});

/**
 * Given - 워크스페이스 미선택 상태
 */
Given("워크스페이스가 선택되어 있지 않다", async ({ page }) => {
  // 워크스페이스 미선택 상태를 시뮬레이션
  // 실제 구현 시 워크스페이스 상태 초기화 로직 추가 필요
  await page.evaluate(() => {
    // 워크스페이스 관련 상태 초기화 (예: localStorage에서 제거)
    localStorage.removeItem("selectedWorkspace");
  });
});

/**
 * Then - 워크스페이스 선택 안내 표시 확인
 */
Then("워크스페이스 선택 안내가 표시된다", async ({ page }) => {
  // 워크스페이스 선택 안내 메시지 또는 UI 확인
  // 실제 구현에 맞게 선택자 수정 필요
  const placeholder = page.locator("text=/워크스페이스|workspace/i").first();
  await expect(placeholder).toBeVisible({ timeout: 10000 });
});
