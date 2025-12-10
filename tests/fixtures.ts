import type { Locator } from "@playwright/test";
import { test as base } from "playwright-bdd";

/**
 * 워크로드 테스트 컨텍스트
 *
 * 각 테스트(시나리오)마다 독립적인 상태를 관리하여
 * 테스트 간 상태 누출을 방지합니다.
 */
export type WorkloadContext = {
  currentRow: Locator | null;
  setCurrentRow: (row: Locator | null) => void;
};

/**
 * 테스트 컨텍스트 타입 정의
 *
 * 새로운 도메인별 컨텍스트가 필요하면 여기에 추가합니다.
 * @example
 * type TestContextFixtures = {
 *   workloadContext: WorkloadContext;
 *   volumeContext: VolumeContext;  // 볼륨 도메인 추가 시
 * };
 */
type TestContextFixtures = {
  workloadContext: WorkloadContext;
};

/**
 * 커스텀 Playwright Test 객체
 *
 * playwright-bdd의 createBdd()에서 이 test 객체를 사용하면
 * Step Definition에서 fixture에 접근할 수 있습니다.
 *
 * @example
 * // steps 파일에서
 * import { createBdd } from "playwright-bdd";
 * import { test } from "../fixtures";
 *
 * const { Given, When, Then } = createBdd(test);
 *
 * Given("목록에 실행중인 워크로드가 있다", async ({ workloadContext }) => {
 *   workloadContext.setCurrentRow(row);
 * });
 */
export const test = base.extend<TestContextFixtures>({
  /**
   * 워크로드 컨텍스트 Fixture
   *
   * 각 테스트 실행 시:
   * 1. 새로운 currentRow = null로 초기화
   * 2. 테스트 실행 (use 호출)
   * 3. 테스트 종료 후 자동 정리 (teardown)
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  workloadContext: async ({}, use) => {
    // 각 테스트마다 새로운 상태로 시작
    let currentRow: Locator | null = null;

    const context: WorkloadContext = {
      get currentRow() {
        return currentRow;
      },
      setCurrentRow: (row: Locator | null) => {
        currentRow = row;
      },
    };

    // 테스트에 컨텍스트 제공
    await use(context);

    // Teardown: 테스트 종료 후 자동 정리
    currentRow = null;
  },
});
