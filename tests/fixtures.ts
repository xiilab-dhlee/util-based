import { expect, type Locator } from "@playwright/test";
import { test as base } from "playwright-bdd";

// ============================================================================
// Constants
// ============================================================================

export type TestMode = "mock" | "integration";

export const TEST_MODE: TestMode =
  (process.env.TEST_MODE as TestMode) || "mock";

export const MOCK_WORKLOAD_ID = "mock-workload-001";
export const MOCK_WORKSPACE_ID = "1";

// ============================================================================
// Types
// ============================================================================

export type AssertLogger = {
  assertEqual: <T>(label: string, actual: T, expected: T) => void;
  assertContains: <T>(label: string, actual: T, validValues: T[]) => void;
  assertNotEmpty: (label: string, actual: string | null | undefined) => void;
  assertMatch: (label: string, actual: string, pattern: RegExp) => void;
  assertLocatorText: (label: string, locator: Locator) => Promise<void>;
};

/**
 * 시나리오 간 상태 공유가 필요한 경우 사용하는 컨텍스트
 * 주의: Step 파라미터로 전달 가능한 값은 context 대신 파라미터 사용 권장
 */
export type PageContext = {
  /** 워크로드 목록: 현재 선택된 행 */
  workloadList: {
    currentRow: Locator | null;
  };
};

export type PageContextActions = {
  /** 워크로드 목록: 현재 선택된 행 설정 */
  setCurrentRow: (row: Locator | null) => void;
  /** 현재 선택된 행 반환 (없으면 에러) */
  assertCurrentRow: () => Locator;
  /** 컨텍스트 초기화 */
  reset: () => void;
};

type TestContextFixtures = {
  pageContext: PageContext & PageContextActions;
  workloadId: string;
  workspaceId: string;
  testMode: TestMode;
  assertLogger: AssertLogger;
};

// ============================================================================
// Helper Functions
// ============================================================================

function logAssertion(
  label: string,
  actual: unknown,
  expected: unknown,
  passed: boolean,
) {
  const icon = passed ? "✓" : "✗";
  console.log(
    `  ${icon} ${label} (기대값: ${JSON.stringify(expected)}, 실제값: ${JSON.stringify(actual)})`,
  );
}

function createAssertLogger(): AssertLogger {
  return {
    assertEqual: <T>(label: string, actual: T, expected: T) => {
      logAssertion(label, actual, expected, actual === expected);
      expect(actual).toBe(expected);
    },

    assertContains: <T>(label: string, actual: T, validValues: T[]) => {
      logAssertion(
        label,
        actual,
        `one of [${validValues.join(", ")}]`,
        validValues.includes(actual),
      );
      expect(validValues).toContain(actual);
    },

    assertNotEmpty: (label: string, actual: string | null | undefined) => {
      const trimmed = actual?.trim() ?? "";
      logAssertion(label, actual, "non-empty string", trimmed.length > 0);
      expect(trimmed.length).toBeGreaterThan(0);
    },

    assertMatch: (label: string, actual: string, pattern: RegExp) => {
      logAssertion(label, actual, pattern.toString(), pattern.test(actual));
      expect(actual).toMatch(pattern);
    },

    assertLocatorText: async (label: string, locator: Locator) => {
      await expect(locator).toBeVisible();
      const text = (await locator.textContent())?.trim() ?? "";
      logAssertion(label, text, "non-empty string", text.length > 0);
      expect(text.length).toBeGreaterThan(0);
    },
  };
}

function createInitialPageContext(): PageContext {
  return {
    workloadList: {
      currentRow: null,
    },
  };
}

// ============================================================================
// Test Fixtures
// ============================================================================

/**
 * 커스텀 Playwright Test 객체
 *
 * @example
 * import { createBdd } from "playwright-bdd";
 * import { test } from "../fixtures";
 *
 * const { Given, When, Then } = createBdd(test);
 *
 * // 워크로드 목록에서 현재 행 설정
 * Given("목록에서 워크로드를 선택한다", async ({ pageContext }) => {
 *   pageContext.setCurrentRow(row);
 *   // 접근: pageContext.workloadList.currentRow
 * });
 */
export const test = base.extend<TestContextFixtures>({
  pageContext: async ({}, use) => {
    const context = createInitialPageContext();

    await use({
      ...context,
      setCurrentRow: (row: Locator | null) => {
        context.workloadList.currentRow = row;
      },
      assertCurrentRow: () => {
        if (!context.workloadList.currentRow) {
          throw new Error(
            "현재 선택된 행이 없습니다. Given 단계에서 행을 먼저 선택하세요.",
          );
        }
        return context.workloadList.currentRow;
      },
      reset: () => {
        context.workloadList.currentRow = null;
      },
    });

    // Teardown: 컨텍스트 초기화
    context.workloadList.currentRow = null;
  },

  testMode: async ({}, use) => {
    await use(TEST_MODE);
  },

  workspaceId: async ({}, use) => {
    await use(MOCK_WORKSPACE_ID);
  },

  workloadId: async ({}, use) => {
    if (TEST_MODE === "mock") {
      await use(MOCK_WORKLOAD_ID);
    }
  },

  assertLogger: async ({}, use) => {
    await use(createAssertLogger());
  },
});
