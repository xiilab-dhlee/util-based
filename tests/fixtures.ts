import { expect, type Locator } from "@playwright/test";
import { test as base } from "playwright-bdd";

import { DrawerComponent } from "./components/drawer.component";
import { ModalComponent } from "./components/modal.component";
import { RadioComponent } from "./components/radio.component";
import { TabsComponent } from "./components/tabs.component";
import { MonitoringPage } from "./pages/monitoring.page";
import { WorkloadDetailPage } from "./pages/workload-detail.page";
import { WorkloadListPage } from "./pages/workload-list.page";
import { WorkloadLogPage } from "./pages/workload-log.page";

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
 * 목록 페이지 공통 컨텍스트
 *
 * 워크로드, 소스코드, 볼륨 등 모든 목록 페이지에서 재사용
 * - currentRow: 현재 선택된 테이블 행
 */
export type ListContext = {
  currentRow: Locator | null;
};

export type ListContextActions = {
  /** 현재 선택된 행 설정 */
  setCurrentRow: (row: Locator | null) => void;
  /** 현재 선택된 행 반환 (없으면 에러) */
  assertCurrentRow: () => Locator;
  /** 컨텍스트 초기화 */
  reset: () => void;
};

/**
 * 워크로드 정보 컨텍스트
 *
 * 워크로드 가져오기/복제 시 선택된 워크로드 정보를 저장
 * - 모달에서 선택한 워크로드
 * - 상세 페이지에서 복제할 워크로드
 */
export type WorkloadContext = {
  name: string;
  description: string;
  jobType: string;
};

export type WorkloadContextActions = {
  /** 워크로드 정보 설정 */
  set: (data: Partial<WorkloadContext>) => void;
  /** 워크로드 정보 반환 (없으면 에러) */
  get: () => WorkloadContext;
  /** 컨텍스트 초기화 */
  reset: () => void;
};

type TestContextFixtures = {
  // 컨텍스트
  listContext: ListContext & ListContextActions;
  workloadContext: WorkloadContext & WorkloadContextActions;
  workloadId: string;
  workspaceId: string;
  testMode: TestMode;
  assertLogger: AssertLogger;

  // Page Objects (페이지별 그룹화)
  workloadListPage: WorkloadListPage;
  workloadDetailPage: WorkloadDetailPage;
  workloadLogPage: WorkloadLogPage;
  monitoringPage: MonitoringPage;

  // 공통 UI 컴포넌트 (페이지와 무관하게 사용)
  modal: ModalComponent;
  drawer: DrawerComponent;
  tabs: TabsComponent;
  radio: RadioComponent;
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

function createInitialListContext(): ListContext {
  return {
    currentRow: null,
  };
}

function createInitialWorkloadContext(): WorkloadContext {
  return {
    name: "",
    description: "",
    jobType: "",
  };
}

// ============================================================================
// Test Fixtures
// ============================================================================

/**
 * 커스텀 Playwright Test 객체
 *
 * Page Object Model 패턴을 사용하여 페이지별로 컴포넌트를 그룹화
 *
 * @example
 * import { createBdd } from "playwright-bdd";
 * import { test } from "../fixtures";
 *
 * const { Given, When, Then } = createBdd(test);
 *
 * // 워크로드 목록 페이지
 * Then("테이블에 데이터가 표시된다", async ({ workloadListPage }) => {
 *   const count = await workloadListPage.table.getRowCount();
 *   expect(count).toBeGreaterThan(0);
 * });
 *
 * // 워크로드 상세 페이지
 * Then("이벤트 카드가 표시된다", async ({ workloadDetailPage }) => {
 *   const count = await workloadDetailPage.eventCards.getCount();
 *   expect(count).toBeGreaterThan(0);
 * });
 *
 * // 모니터링 페이지
 * Then("그래프가 표시된다", async ({ monitoringPage }) => {
 *   await monitoringPage.resourceGraph.assertVisible();
 * });
 */
export const test = base.extend<TestContextFixtures>({
  listContext: async ({}, use) => {
    const context = createInitialListContext();

    await use({
      ...context,
      setCurrentRow: (row: Locator | null) => {
        context.currentRow = row;
      },
      assertCurrentRow: () => {
        if (!context.currentRow) {
          throw new Error(
            "현재 선택된 행이 없습니다. Given 단계에서 행을 먼저 선택하세요.",
          );
        }
        return context.currentRow;
      },
      reset: () => {
        context.currentRow = null;
      },
    });

    // Teardown: 컨텍스트 초기화
    context.currentRow = null;
  },

  workloadContext: async ({}, use) => {
    const context = createInitialWorkloadContext();

    await use({
      ...context,
      set: (data: Partial<WorkloadContext>) => {
        Object.assign(context, data);
      },
      get: () => {
        if (!context.name && !context.jobType) {
          throw new Error(
            "워크로드 정보가 없습니다. 먼저 워크로드를 선택하세요.",
          );
        }
        return context;
      },
      reset: () => {
        context.name = "";
        context.description = "";
        context.jobType = "";
      },
    });

    // Teardown: 컨텍스트 초기화
    context.name = "";
    context.description = "";
    context.jobType = "";
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

  // ============================================================================
  // Page Objects (페이지별 그룹화)
  // ============================================================================

  workloadListPage: async ({ page }, use) => {
    await use(new WorkloadListPage(page));
  },

  workloadDetailPage: async ({ page }, use) => {
    await use(new WorkloadDetailPage(page));
  },

  workloadLogPage: async ({ page }, use) => {
    await use(new WorkloadLogPage(page));
  },

  monitoringPage: async ({ page }, use) => {
    await use(new MonitoringPage(page));
  },

  // ============================================================================
  // 공통 UI 컴포넌트 (페이지와 무관)
  // ============================================================================

  modal: async ({ page }, use) => {
    await use(new ModalComponent(page));
  },

  drawer: async ({ page }, use) => {
    await use(new DrawerComponent(page));
  },

  tabs: async ({ page }, use) => {
    await use(new TabsComponent(page, ".tabs-nav"));
  },

  radio: async ({ page }, use) => {
    await use(new RadioComponent(page));
  },
});
