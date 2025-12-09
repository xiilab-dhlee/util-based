import type { Locator } from "@playwright/test";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";

/**
 * 워크로드 테스트 헬퍼
 *
 * 워크로드 관련 E2E 테스트에서 공통으로 사용하는 유틸리티 함수들
 */

/**
 * 버튼 이름과 셀렉터 매핑
 * Feature 파일의 버튼 이름을 data-testid로 변환
 */
export const BUTTON_SELECTOR_MAP: Record<string, string> = {
  로그: WORKLOAD_SELECTOR.LOG_BUTTON,
  웹터미널: WORKLOAD_SELECTOR.TERMINAL_BUTTON,
  모니터링: WORKLOAD_SELECTOR.MONITORING_BUTTON,
  종료: WORKLOAD_SELECTOR.STOP_BUTTON,
  삭제: WORKLOAD_SELECTOR.DELETE_BUTTON,
  재시작: WORKLOAD_SELECTOR.RESTART_BUTTON,
};

/**
 * 워크로드 행에서 버튼 Locator를 가져오는 헬퍼 함수
 *
 * @param workloadRow - 워크로드 테이블 행 Locator
 * @param buttonName - 버튼 이름 (로그, 웹터미널, 모니터링, 종료, 삭제, 재시작)
 * @returns 버튼 Locator
 * @throws 알 수 없는 버튼 이름인 경우 에러
 *
 * @example
 * const button = getWorkloadButton(workloadRow, "로그");
 * await expect(button).toBeEnabled();
 */
export function getWorkloadButton(
  workloadRow: Locator,
  buttonName: string,
): Locator {
  const selector = BUTTON_SELECTOR_MAP[buttonName];

  if (!selector) {
    throw new Error(
      `알 수 없는 버튼: ${buttonName}. 가능한 값: ${Object.keys(BUTTON_SELECTOR_MAP).join(", ")}`,
    );
  }

  return workloadRow.locator(testId(selector));
}

/**
 * 워크로드 행이 설정되어 있는지 검증하는 함수
 *
 * @param workloadRow - 워크로드 테이블 행 Locator (null일 수 있음)
 * @returns 워크로드 행 Locator
 * @throws workloadRow가 null인 경우 에러
 */
export function assertWorkloadRow(workloadRow: Locator | null): Locator {
  if (!workloadRow) {
    throw new Error(
      "워크로드 행이 설정되지 않았습니다. Given 단계를 먼저 실행하세요.",
    );
  }
  return workloadRow;
}
