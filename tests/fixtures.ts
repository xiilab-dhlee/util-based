import type { Locator } from "@playwright/test";
import { test as base } from "playwright-bdd";

import { SELECTOR } from "@/shared/constants/selector.constant";
import { ButtonComponent } from "./components/button.component";
import { CardGridComponent } from "./components/card-grid.component";
import { DataTableComponent } from "./components/data-table.component";
import { DrawerComponent } from "./components/drawer.component";
import { ModalComponent } from "./components/modal.component";
import { NavigationComponent } from "./components/navigation.component";
import { PaginationComponent } from "./components/pagination.component";
import { RadioComponent } from "./components/radio.component";
import { SearchInputComponent } from "./components/search-input.component";
import { SwitchComponent } from "./components/switch.component";
import { TabsComponent } from "./components/tabs.component";
import { ThemePopoverComponent } from "./components/theme-popover.component";
import { AccountManagementPage } from "./pages/account-management.page";
import { AccountPendingPage } from "./pages/account-pending.page";
import { HubPage } from "./pages/hub.page";
import { MonitoringPage } from "./pages/monitoring.page";
import { PrivateRegistryListPage } from "./pages/private-registry-list.page";
import { SettingPage } from "./pages/setting.page";
import { SignupPage } from "./pages/signup.page";
import { WorkloadDetailPage } from "./pages/workload-detail.page";
import { WorkloadListPage } from "./pages/workload-list.page";
import { WorkloadLogPage } from "./pages/workload-log.page";
import { WorkloadMonitoringPage } from "./pages/workload-monitoring.page";
import { WorkloadTerminalPage } from "./pages/workload-terminal.page";
import { type AssertLogger, createAssertLogger } from "./support/assert-logger";

// ============================================================================
// Constants
// ============================================================================

export type TestMode = "mock" | "integration";

export const TEST_MODE: TestMode =
  (process.env.TEST_MODE as TestMode) || "mock";

export const MOCK_WORKLOAD_ID = "mock-workload-001";
export const MOCK_WORKSPACE_ID = 1;

// ============================================================================
// Types
// ============================================================================

// AssertLogger 타입 re-export
export type { AssertLogger };

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

/**
 * ThemeContext: 테마 선택 관련 테스트 컨텍스트
 *
 * 용도:
 * - 선택된 테마 이름 저장 및 검증
 */
export type ThemeContext = {
  selectedTheme: string | null;
};

export type ThemeContextActions = {
  /** 선택된 테마 설정 */
  setSelectedTheme: (theme: string) => void;
  /** 선택된 테마 반환 (없으면 에러) */
  assertSelectedTheme: () => string;
  /** 컨텍스트 초기화 */
  reset: () => void;
};

type TestContextFixtures = {
  // 컨텍스트
  listContext: ListContext & ListContextActions;
  workloadContext: WorkloadContext & WorkloadContextActions;
  themeContext: ThemeContext & ThemeContextActions;
  workloadId: string;
  workspaceId: number;
  testMode: TestMode;
  assertLogger: AssertLogger;

  // Page Objects (페이지별 그룹화)
  settingPage: SettingPage;
  signupPage: SignupPage;
  workloadListPage: WorkloadListPage;
  workloadDetailPage: WorkloadDetailPage;
  workloadLogPage: WorkloadLogPage;
  workloadMonitoringPage: WorkloadMonitoringPage;
  workloadTerminalPage: WorkloadTerminalPage;
  monitoringPage: MonitoringPage;
  hubPage: HubPage;
  accountManagementPage: AccountManagementPage;
  accountPendingPage: AccountPendingPage;
  privateRegistryListPage: PrivateRegistryListPage;

  // 공통 UI 컴포넌트 (페이지와 무관하게 사용)
  modal: ModalComponent;
  drawer: DrawerComponent;
  tabs: TabsComponent;
  radio: RadioComponent;
  themePopover: ThemePopoverComponent;
  navigation: NavigationComponent;

  // 목록 페이지 공통 컴포넌트
  /** 목록 테이블 험블 객체 */
  listTable: DataTableComponent;
  /** 목록 카드 그리드 험블 객체 (허브 등 카드형 목록) */
  listGrid: CardGridComponent;
  /** 내 항목만 보기 스위치 험블 객체 */
  myItemsSwitch: SwitchComponent;
  /** 검색 입력창 험블 객체 */
  listSearchInput: SearchInputComponent;
  /** 페이지네이션 험블 객체 */
  listPagination: PaginationComponent;
  /** 목록 삭제 버튼 험블 객체 */
  listDeleteButton: ButtonComponent;
};

// ============================================================================
// Helper Functions
// ============================================================================

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

function createInitialThemeContext(): ThemeContext {
  return {
    selectedTheme: null,
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

  themeContext: async ({}, use) => {
    const context = createInitialThemeContext();

    await use({
      ...context,
      setSelectedTheme: (theme: string) => {
        context.selectedTheme = theme;
      },
      assertSelectedTheme: () => {
        if (!context.selectedTheme) {
          throw new Error(
            "테마 컨텍스트가 초기화되지 않았습니다. 테마를 먼저 선택하세요.",
          );
        }
        return context.selectedTheme;
      },
      reset: () => {
        context.selectedTheme = null;
      },
    });

    // Teardown: 컨텍스트 초기화
    context.selectedTheme = null;
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

  settingPage: async ({ page }, use) => {
    await use(new SettingPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  workloadListPage: async ({ page }, use) => {
    await use(new WorkloadListPage(page));
  },

  workloadDetailPage: async ({ page }, use) => {
    await use(new WorkloadDetailPage(page));
  },

  workloadLogPage: async ({ page }, use) => {
    await use(new WorkloadLogPage(page));
  },

  workloadMonitoringPage: async ({ page }, use) => {
    await use(new WorkloadMonitoringPage(page));
  },

  workloadTerminalPage: async ({ page }, use) => {
    await use(new WorkloadTerminalPage(page));
  },

  monitoringPage: async ({ page }, use) => {
    await use(new MonitoringPage(page));
  },

  hubPage: async ({ page }, use) => {
    await use(new HubPage(page));
  },

  accountManagementPage: async ({ page }, use) => {
    await use(new AccountManagementPage(page));
  },

  accountPendingPage: async ({ page }, use) => {
    await use(new AccountPendingPage(page));
  },

  privateRegistryListPage: async ({ page }, use) => {
    await use(new PrivateRegistryListPage(page));
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
    await use(new TabsComponent(page));
  },

  radio: async ({}, use) => {
    await use(new RadioComponent());
  },

  themePopover: async ({ page }, use) => {
    await use(new ThemePopoverComponent(page));
  },

  navigation: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },

  // ============================================================================
  // 목록 페이지 공통 컴포넌트
  // ============================================================================

  listTable: async ({ page }, use) => {
    await use(new DataTableComponent(page, SELECTOR.LIST_TABLE));
  },

  listGrid: async ({ page }, use) => {
    await use(new CardGridComponent(page, SELECTOR.LIST_CARD));
  },

  myItemsSwitch: async ({ page }, use) => {
    await use(new SwitchComponent(page, SELECTOR.MY_ITEMS_ONLY_SWITCH));
  },

  listSearchInput: async ({ page }, use) => {
    await use(new SearchInputComponent(page, SELECTOR.LIST_SEARCH_INPUT));
  },

  listPagination: async ({ page }, use) => {
    await use(new PaginationComponent(page, SELECTOR.LIST_PAGINATION));
  },

  listDeleteButton: async ({ page }, use) => {
    await use(new ButtonComponent(page, SELECTOR.LIST_DELETE_BUTTON));
  },
});
