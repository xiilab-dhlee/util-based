import type { Page } from "@playwright/test";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { FilterDropdownComponent } from "../components/filter-dropdown.component";
import { TabsComponent } from "../components/tabs.component";
import { ListPage } from "./list.page";

/**
 * 워크로드 목록 페이지 Page Object
 *
 * ListPage를 상속하여 워크로드 목록 페이지 전용 기능 제공:
 * - jobTypeFilter: Job Type 필터 드롭다운
 * - statusFilter: 상태 필터 드롭다운
 * - searchByFirstWorkloadName(): 첫 번째 워크로드 이름으로 검색
 *
 * 상속 계층: BasePage > ListPage > WorkloadListPage
 *
 * @example
 * const workloadListPage = new WorkloadListPage(page);
 * await workloadListPage.goto();
 * await workloadListPage.jobTypeFilter.select("Batch");
 */
export class WorkloadListPage extends ListPage {
  // ============================================
  // 도메인 상수 (Static)
  // ============================================

  /** 목록 페이지 행 버튼 셀렉터 */
  static readonly ROW_BUTTON: Record<string, string> = {
    로그: WORKLOAD_SELECTOR.LOG_BUTTON,
    웹터미널: WORKLOAD_SELECTOR.TERMINAL_BUTTON,
    모니터링: WORKLOAD_SELECTOR.MONITORING_BUTTON,
    종료: WORKLOAD_SELECTOR.STOP_BUTTON,
    삭제: WORKLOAD_SELECTOR.DELETE_BUTTON,
    재시작: WORKLOAD_SELECTOR.RESTART_BUTTON,
  };

  /** 모니터링 차트 ID */
  static readonly CHART_ID: Record<string, string> = {
    "CPU 사용량": "cpu-usage",
    "Memory 사용량": "memory-usage",
    "GPU 사용률": "gpu-utilization",
    "GPU 메모리": "gpu-memory",
  };

  /** 로그/웹터미널 페이지 버튼 셀렉터 */
  static readonly PAGE_BUTTON: Record<
    string,
    { monitoring: string; theme: string }
  > = {
    로그: {
      monitoring: WORKLOAD_SELECTOR.LOG_MONITORING_BUTTON,
      theme: WORKLOAD_SELECTOR.LOG_THEME_BUTTON,
    },
    웹터미널: {
      monitoring: WORKLOAD_SELECTOR.TERMINAL_MONITORING_BUTTON,
      theme: WORKLOAD_SELECTOR.TERMINAL_THEME_BUTTON,
    },
  };

  /** 생성 드로어 버튼 셀렉터 */
  static readonly CREATE_BUTTON: Record<string, string> = {
    "최근 워크로드 가져오기": WORKLOAD_SELECTOR.CREATE_RECENT_IMPORT_BUTTON,
    "워크로드 목록에서 가져오기": WORKLOAD_SELECTOR.CREATE_LIST_IMPORT_BUTTON,
  };

  // ============================================
  // Instance Properties
  // ============================================

  /** Job Type 필터 드롭다운 */
  readonly jobTypeFilter: FilterDropdownComponent;
  /** 상태 필터 드롭다운 */
  readonly statusFilter: FilterDropdownComponent;
  /** 탭 컴포넌트 (활성화/비활성화) */
  readonly tabs: TabsComponent;

  constructor(page: Page) {
    super(page);
    this.jobTypeFilter = new FilterDropdownComponent(
      page,
      WORKLOAD_SELECTOR.FILTER_JOB_TYPE,
    );
    this.statusFilter = new FilterDropdownComponent(
      page,
      WORKLOAD_SELECTOR.FILTER_STATUS,
    );
    this.tabs = new TabsComponent(page, ".tabs-nav");
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return WORKLOAD_SELECTOR.PAGE_HEADER;
  }

  protected get basePath(): string {
    return "/user/workload";
  }

  protected get tableIdentifierTestId(): string {
    return WORKLOAD_SELECTOR.NAME;
  }

  // ============================================
  // Navigation (확장)
  // ============================================

  /**
   * 비활성화 워크로드 목록 페이지로 이동
   */
  async gotoDisabled(): Promise<void> {
    await this.goto("/disabled");
  }

  // ============================================
  // Actions (확장)
  // ============================================

  /**
   * 첫 번째 워크로드 이름으로 검색
   */
  async searchByFirstWorkloadName(): Promise<void> {
    const name = await this.table.getFirstCellText(WORKLOAD_SELECTOR.NAME);
    await this.search(name);
  }
}
