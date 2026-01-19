import { createBdd } from "playwright-bdd";

import { WORKLOAD_ENDPOINTS } from "@/shared/constants/endpoint.constant";
import { test } from "../../fixtures";
import { mockApiError, mockEmptyList } from "../../support/mocks/mock-override";

/**
 * 워크로드 목록 Edge Case Step Definitions
 *
 * 예외 상황 테스트:
 * 1. API 에러 핸들링
 * 2. 빈 목록 처리
 *
 * NOTE: 검색 관련 Step은 search.steps.ts로 분리됨
 */
const { Given } = createBdd(test);

// ============================================
// 1. API 에러 핸들링
// ============================================

/**
 * 활성화 워크로드 목록 API가 500 에러를 반환하도록 모킹 설정
 */
Given(
  "활성화 워크로드 목록 API가 500 에러를 반환하도록 설정한다",
  async ({ page }) => {
    await mockApiError(page, WORKLOAD_ENDPOINTS.active);
  },
);

/**
 * 비활성화 워크로드 목록 API가 500 에러를 반환하도록 모킹 설정
 */
Given(
  "비활성화 워크로드 목록 API가 500 에러를 반환하도록 설정한다",
  async ({ page }) => {
    await mockApiError(page, WORKLOAD_ENDPOINTS.base);
  },
);

// ============================================
// 2. 빈 목록 처리
// ============================================

/**
 * 활성화 워크로드 목록 API가 빈 목록을 반환하도록 모킹 설정
 */
Given(
  "활성화 워크로드 목록 API가 빈 목록을 반환하도록 설정한다",
  async ({ page }) => {
    await mockEmptyList(page, WORKLOAD_ENDPOINTS.active);
  },
);

/**
 * 비활성화 워크로드 목록 API가 빈 목록을 반환하도록 모킹 설정
 */
Given(
  "비활성화 워크로드 목록 API가 빈 목록을 반환하도록 설정한다",
  async ({ page }) => {
    await mockEmptyList(page, WORKLOAD_ENDPOINTS.base);
  },
);
