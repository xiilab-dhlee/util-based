import type { Page } from "@playwright/test";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { DropdownComponent } from "../components/dropdown.component";
import { ListPage } from "./list.page";

/**
 * 워크로드 목록 페이지 Page Object
 *
 * ListPage를 상속하여 워크로드 목록 페이지 전용 기능 제공:
 * - jobTypeFilter: Job Type 필터 드롭다운
 * - statusFilter: 상태 필터 드롭다운
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

  /** 생성 드로어 버튼 셀렉터 */
  static readonly CREATE_BUTTON: Record<string, string> = {
    "최근 워크로드 가져오기": WORKLOAD_SELECTOR.CREATE_RECENT_IMPORT_BUTTON,
    "워크로드 목록에서 가져오기": WORKLOAD_SELECTOR.CREATE_LIST_IMPORT_BUTTON,
  };

  // ============================================
  // Instance Properties
  // ============================================

  /** Job Type 필터 드롭다운 */
  readonly jobTypeFilter: DropdownComponent;
  /** 상태 필터 드롭다운 */
  readonly statusFilter: DropdownComponent;

  constructor(page: Page) {
    super(page);
    this.jobTypeFilter = new DropdownComponent(
      page,
      WORKLOAD_SELECTOR.FILTER_JOB_TYPE,
    );
    this.statusFilter = new DropdownComponent(
      page,
      WORKLOAD_SELECTOR.FILTER_STATUS,
    );
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
}
