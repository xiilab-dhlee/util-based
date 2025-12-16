/**
 * ============================================
 * ARCHIVED: 2025-12-15
 * 사유: E2E 테스트로 적합하지 않음
 * - UI 존재 여부/초기 상태 검증은 사용자 행동 검증이 아님
 * - 네비게이션 메뉴 활성화 = CSS 스타일링 이슈
 * - 총 개수/페이지네이션은 테이블이 표시되면 자연스럽게 따라오는 UI
 * - 필터 초기값은 구현 세부사항
 * - 참고: docs/test-philosophy.md
 * ============================================
 *
 * 아래 Step들은 entry-ui-details.feature와 함께 사용됩니다.
 * 필요 시 복원하여 사용할 수 있습니다.
 */

import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

const { Then } = createBdd(test);

// ============================================
// 네비게이션 메뉴 관련 Steps
// ============================================

/**
 * 네비게이션 메뉴 활성화 상태 검증
 *
 * 제거 사유:
 * - 네비게이션 메뉴 활성화 = CSS 스타일링 이슈
 * - 페이지 진입 + URL 검증으로 충분
 */
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

/**
 * 아카이브된 시나리오에서 사용된 Step 목록:
 *
 * 1. 목록에 총 개수가 표시된다
 *    - 위치: tests/steps/common.steps.ts (제거됨)
 *
 * 2. 페이지네이션이 표시된다
 *    - 위치: tests/steps/common.steps.ts (제거됨)
 *
 * 3. 잡 타입 필터가 빈 값으로 표시된다
 *    - 위치: tests/steps/workload/list.steps.ts (제거됨)
 *
 * 4. 상태 필터가 빈 값으로 표시된다
 *    - 위치: tests/steps/workload/list.steps.ts (제거됨)
 *
 * 5. 검색창이 빈 값으로 표시된다
 *    - 위치: tests/steps/common.steps.ts (제거됨)
 *
 * 6. 네비게이션 메뉴 중 "{menu}" 메뉴가 활성화되어 있다
 *    - 이 파일에 아카이브됨
 *
 * 7. "{tab}" 탭이 선택되어 있다
 *    - 위치: tests/steps/common.steps.ts
 *    - 다른 사용처: disabled-workload-list-interaction.feature
 *    - 유지 필요
 */
