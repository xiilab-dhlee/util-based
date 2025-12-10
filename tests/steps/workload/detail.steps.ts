import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { extractStatusFromTestId } from "../../support/workload.helper";

/**
 * 워크로드 상세 페이지 Step Definitions
 *
 * 상세 페이지 관련 Step만 정의
 * - 페이지 진입
 * - 좌측 요약 패널 (기본 정보)
 * - 이벤트 이력
 * - 탭 관련
 * - 상세정보 탭 내용
 * - 상태별 검증
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 상세 페이지 진입 Steps
// ============================================

/**
 * Then - 워크로드 상세 페이지 표시 확인
 */
Then("워크로드 상세 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(WORKLOAD_SELECTOR.PAGE_HEADER_DETAIL));
  await expect(pageHeader).toBeVisible();
});

/**
 * When - 첫 번째 워크로드 클릭하여 상세 페이지로 이동
 * 상태 무관하게 첫 번째 워크로드를 클릭
 * URL 검증은 별도의 Then step에서 수행
 */
When(
  "첫 번째 워크로드의 이름을 클릭하여 상세 페이지로 이동한다",
  async ({ page }) => {
    const nameLink = page.locator(testIdPrefix("workload-name-")).first();
    await expect(nameLink).toBeVisible({ timeout: 10000 });
    await nameLink.click();
    await page.waitForLoadState("networkidle");
  },
);

// ============================================
// 좌측 요약 패널 Steps (기본 정보)
// ============================================

/**
 * Then - 워크로드 이름이 표시된다
 * 빈 값일 경우 "-"로 표시되므로, "-"가 아니면 유효한 값
 */
Then("워크로드 이름이 표시된다", async ({ page }) => {
  const name = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NAME));
  await expect(name).toBeVisible();
  await expect(name).not.toHaveText("-");
});

/**
 * Then - 워크로드 상태가 다음 중 하나로 표시된다 (단일 검증)
 * data-testid에서 상태값을 추출하여 유효한 상태인지 검증
 */
Then(
  "워크로드 상태가 다음 중 하나로 표시된다:",
  async ({ page }, dataTable: DataTable) => {
    const validStatuses = dataTable.rows().map((row) => row[0]);

    // 상세 페이지의 상태 요소 조회
    const statusElement = page.locator(testIdPrefix("workload-status-"));
    await expect(statusElement).toBeVisible();

    // data-testid에서 상태값 추출 및 유효성 검증
    const status = await extractStatusFromTestId(statusElement);
    expect(validStatuses).toContain(status);
  },
);

/**
 * Then - 워크로드 설명이 표시된다
 */
Then("워크로드 설명이 표시된다", async ({ page }) => {
  const description = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_DESCRIPTION),
  );
  await expect(description).toBeVisible();
});

/**
 * Then - 워크로드 버튼 표시 확인 (파라미터화)
 * @example
 * Then 워크로드 수정 버튼이 표시된다
 * Then 워크로드 종료 버튼이 표시된다
 */
Then(
  "워크로드 {word} 버튼이 표시된다",
  async ({ page }, buttonName: string) => {
    /**
     * 상세 페이지 버튼 이름 → 셀렉터 매핑
     */
    const DETAIL_BUTTON_MAP: Record<string, string> = {
      수정: WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON,
      종료: WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON,
      재시작: WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON,
      삭제: WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON,
    };

    const selector = DETAIL_BUTTON_MAP[buttonName];
    if (!selector) {
      throw new Error(
        `알 수 없는 버튼: ${buttonName}. 가능한 값: ${Object.keys(DETAIL_BUTTON_MAP).join(", ")}`,
      );
    }
    const button = page.locator(testId(selector));
    await expect(button).toBeVisible();
  },
);

// ============================================
// 이벤트 이력 Steps
// ============================================

/**
 * Then - 이벤트 이름 빈 값 아님 확인
 */
Then("이벤트 이름이 빈 값이 아니다", async ({ page }) => {
  const eventNames = page.locator(testId(WORKLOAD_SELECTOR.EVENT_NAME));
  const count = await eventNames.count();

  for (let i = 0; i < count; i++) {
    const element = eventNames.nth(i);
    const text = await element.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }
});

/**
 * Then - 이벤트 상태 유효성 검증
 */
Then(
  "이벤트 상태가 다음 중 하나이다:",
  async ({ page }, dataTable: DataTable) => {
    const validStatuses = dataTable.raw().slice(1).flat();
    const eventStatuses = page.locator(testId(WORKLOAD_SELECTOR.EVENT_STATUS));
    const count = await eventStatuses.count();

    for (let i = 0; i < count; i++) {
      const element = eventStatuses.nth(i);
      const text = await element.textContent();
      expect(validStatuses).toContain(text?.trim());
    }
  },
);

/**
 * Then - 경과 시간 표시 확인
 */
Then("경과 시간이 표시된다", async ({ page }) => {
  const elapsedTimes = page.locator(
    testId(WORKLOAD_SELECTOR.EVENT_ELAPSED_TIME),
  );
  const count = await elapsedTimes.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

/**
 * Then - From 값 빈 값 아님 확인
 */
Then("From 값이 빈 값이 아니다", async ({ page }) => {
  const fromValues = page.locator(testId(WORKLOAD_SELECTOR.EVENT_FROM));
  const count = await fromValues.count();

  for (let i = 0; i < count; i++) {
    const element = fromValues.nth(i);
    const text = await element.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }
});

/**
 * Then - 메시지 영역 표시 확인
 */
Then("메시지 영역이 표시된다", async ({ page }) => {
  const messages = page.locator(testId(WORKLOAD_SELECTOR.EVENT_MESSAGE));
  const count = await messages.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

// ============================================
// 상세정보 탭 내용 Steps
// ============================================

/**
 * Then - Job Type 영역 표시 확인
 */
Then("Job Type 영역이 표시된다", async ({ page }) => {
  const jobType = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_JOB_TYPE));
  await expect(jobType).toBeVisible();
});

/**
 * Then - 노드 타입 영역 표시 확인
 */
Then("노드 타입 영역이 표시된다", async ({ page }) => {
  const nodeType = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NODE_TYPE));
  await expect(nodeType).toBeVisible();
});

/**
 * Then - 이미지 섹션 표시 확인
 */
Then("이미지 섹션이 표시된다", async ({ page }) => {
  const imageSection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_SECTION),
  );
  await expect(imageSection).toBeVisible();
});

/**
 * Then - 이미지 이름 빈 값 아님 확인
 */
Then("이미지 이름이 빈 값이 아니다", async ({ page }) => {
  const imageName = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_NAME));
  await expect(imageName).toBeVisible();
  const text = await imageName.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

/**
 * Then - Commit Image 생성 버튼 표시 확인
 */
Then(
  "내부 레지스트리 영역에 Commit Image 생성 버튼이 표시된다",
  async ({ page }) => {
    const commitButton = page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_COMMIT_IMAGE_BUTTON),
    );
    await expect(commitButton).toBeVisible();
  },
);

/**
 * Then - 리소스 섹션 표시 확인
 */
Then("리소스 섹션이 표시된다", async ({ page }) => {
  const resourceSection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_SECTION),
  );
  await expect(resourceSection).toBeVisible();
});

/**
 * Then - 선택한 GPU 정보 표시 확인
 */
Then("선택한 GPU 정보가 표시된다", async ({ page }) => {
  const gpuSelection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_GPU_SELECTION),
  );
  await expect(gpuSelection).toBeVisible();
});

/**
 * Then - 리소스 값 표시 확인 (GPU, CPU, Memory)
 */
Then("GPU 리소스 값이 표시된다", async ({ page }) => {
  const gpuResource = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_GPU),
  );
  await expect(gpuResource).toBeVisible();
});

Then("CPU 리소스 값이 표시된다", async ({ page }) => {
  const cpuResource = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_CPU),
  );
  await expect(cpuResource).toBeVisible();
});

Then("Memory 리소스 값이 표시된다", async ({ page }) => {
  const memoryResource = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_MEMORY),
  );
  await expect(memoryResource).toBeVisible();
});

/**
 * Then - 생성자 정보 표시 확인
 */
Then("생성자 정보가 표시된다", async ({ page }) => {
  const creator = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CREATOR));
  await expect(creator).toBeVisible();
});

/**
 * Then - 생성일 날짜 형식 확인
 */
Then("생성일이 날짜 형식으로 표시된다", async ({ page }) => {
  const createdDate = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_CREATED_DATE),
  );
  await expect(createdDate).toBeVisible();

  const text = await createdDate.textContent();
  // yyyy.MM.dd 형식 검증
  expect(text).toMatch(/\d{4}\.\d{2}\.\d{2}/);
});

// ============================================
// 상태별 검증 Steps
// ============================================

/**
 * Given - 워크로드 상태 확인 (상태별 시나리오용)
 * 현재 상세 페이지의 워크로드 상태가 지정된 상태인지 확인
 * data-testid에서 상태값을 추출하여 비교
 */
Given(
  "워크로드 상태가 {string}이다",
  async ({ page, $testInfo }, status: string) => {
    /**
     * 한글 상태명 → data-testid 상태값 매핑
     */
    const STATUS_MAP: Record<string, string> = {
      실행중: "running",
      대기중: "pending",
      종료: "completed",
      에러: "failed",
    };

    const statusElement = page.locator(testIdPrefix("workload-status-"));
    await expect(statusElement).toBeVisible();

    // data-testid에서 상태값 추출
    const currentStatus = await extractStatusFromTestId(statusElement);
    const expectedStatus = STATUS_MAP[status] ?? status;

    // 현재 상태가 지정된 상태와 다르면 시나리오 스킵
    if (currentStatus !== expectedStatus) {
      $testInfo.skip(
        true,
        `현재 워크로드 상태가 "${status}"이(가) 아니어서 시나리오를 스킵합니다 (현재: ${currentStatus})`,
      );
    }
  },
);
