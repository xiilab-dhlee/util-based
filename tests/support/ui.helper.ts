import type { Page } from "@playwright/test";

/**
 * UI 공통 헬퍼
 *
 * Ant Design 기반 컴포넌트 조작을 위한 공통 유틸리티 함수들
 */

/**
 * Ant Design Select 드롭다운에서 옵션 선택
 *
 * @param page - Playwright Page 객체
 * @param filterSelector - 필터 셀렉터 (data-testid 등)
 * @param label - 선택할 옵션 라벨
 *
 * @example
 * await selectDropdownOption(page, '[data-testid="workload-filter-jobType"]', "Batch");
 */
export async function selectDropdownOption(
  page: Page,
  filterSelector: string,
  label: string,
): Promise<void> {
  await page.locator(filterSelector).click();
  await page
    .locator(".ant-select-dropdown:visible .ant-select-item-option-content", {
      hasText: label,
    })
    .click();
  await page.waitForLoadState("networkidle");
}
