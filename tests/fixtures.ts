import { expect, type Locator, type Page } from "@playwright/test";
import { test as base } from "playwright-bdd";

import { testIdPrefix } from "@/shared/constants/selector.constant";

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

export type WorkloadContext = {
  currentRow: Locator | null;
  setCurrentRow: (row: Locator | null) => void;
};

type TestContextFixtures = {
  workloadContext: WorkloadContext;
  workloadId: string;
  workspaceId: string;
  testMode: TestMode;
  goToWorkloadDetail: (page: Page) => Promise<void>;
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

async function getWorkloadIdFromList(page: Page): Promise<string> {
  await page.goto("/user/workload");
  await page.waitForLoadState("networkidle");

  const firstWorkload = page.locator(testIdPrefix("workload-name-")).first();
  const testId = await firstWorkload.getAttribute("data-testid");

  if (!testId) {
    throw new Error("워크로드를 찾을 수 없습니다. 목록이 비어있습니다.");
  }

  return testId.replace("workload-name-", "");
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
 */
export const test = base.extend<TestContextFixtures>({
  workloadContext: async ({}, use) => {
    let currentRow: Locator | null = null;

    await use({
      get currentRow() {
        return currentRow;
      },
      setCurrentRow: (row: Locator | null) => {
        currentRow = row;
      },
    });

    currentRow = null;
  },

  testMode: async ({}, use) => {
    await use(TEST_MODE);
  },

  workspaceId: async ({}, use) => {
    await use(MOCK_WORKSPACE_ID);
  },

  workloadId: async ({ page }, use) => {
    if (TEST_MODE === "mock") {
      await use(MOCK_WORKLOAD_ID);
    } else {
      await use(await getWorkloadIdFromList(page));
    }
  },

  goToWorkloadDetail: async ({ workloadId }, use) => {
    await use(async (targetPage: Page) => {
      await targetPage.goto(`/user/workload/${workloadId}`);
      await targetPage.waitForLoadState("networkidle");
    });
  },

  assertLogger: async ({}, use) => {
    await use(createAssertLogger());
  },
});
