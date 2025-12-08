/**
 * E2E 테스트용 data-testid 셀렉터 상수
 *
 * data-testid-registry.md 문서와 동기화하여 관리합니다.
 * 새로운 셀렉터 추가 시 반드시 문서에도 등록하세요.
 *
 * 네이밍 컨벤션:
 * - {도메인}-{컴포넌트}-{역할}
 * - {도메인}-{컴포넌트}-{id}
 */

// ============================================
// 공통 (Shared)
// ============================================

export const SHARED_TEST_ID = {
  /** 목록 테이블 래퍼 */
  LIST_TABLE: "list-table",
  /** 총 개수 표시 */
  LIST_TOTAL_COUNT: "list-total-count",
  /** 페이지네이션 */
  LIST_PAGINATION: "list-pagination",
  /** 검색 입력창 */
  LIST_SEARCH_INPUT: "list-search-input",
  /** 필터 영역 */
  LIST_FILTER: "list-filter",
} as const;

// ============================================
// 워크로드 (Workload)
// ============================================

export const WORKLOAD_TEST_ID = {
  // 페이지 헤더
  /** 워크로드 목록 페이지 헤더 */
  PAGE_HEADER: "user.workload",
  /** 워크로드 상세 페이지 헤더 */
  PAGE_HEADER_DETAIL: "user.workload.detail",

  // 목록 테이블 데이터 (동적)
  /** 워크로드 이름 링크 - workload-name-{id} */
  name: (id: string | number) => `workload-name-${id}`,
  /** 잡 타입 텍스트 - workload-job-type-{id} */
  jobType: (id: string | number) => `workload-job-type-${id}`,
  /** 경과 시간 - workload-elapsed-time-{id} */
  elapsedTime: (id: string | number) => `workload-elapsed-time-${id}`,
  /** 상태 라벨 - workload-status-{status} */
  status: (status: string) => `workload-status-${status}`,

  // 액션 버튼
  /** 로그 버튼 */
  LOG_BUTTON: "workload-log-button",
  /** 웹터미널 버튼 */
  TERMINAL_BUTTON: "workload-terminal-button",
  /** 모니터링 버튼 */
  MONITORING_BUTTON: "workload-monitoring-button",
  /** 연결(포트) 버튼 */
  CONNECT_BUTTON: "workload-connect-button",
  /** 종료 버튼 */
  STOP_BUTTON: "workload-stop-button",
  /** 삭제 버튼 */
  DELETE_BUTTON: "workload-delete-button",
  /** 재시작 버튼 */
  RESTART_BUTTON: "workload-restart-button",

  // 필터
  /** 잡 타입 필터 */
  FILTER_JOB_TYPE: "workload-filter-jobType",
  /** 상태 필터 */
  FILTER_STATUS: "workload-filter-status",
} as const;

// ============================================
// 사용자 모니터링 (User Monitoring)
// ============================================

export const USER_MONITORING_TEST_ID = {
  // 페이지 헤더
  /** 모니터링 페이지 헤더 */
  PAGE_HEADER: "user.monitoring",

  // 위젯
  /** CPU 리소스 그래프 */
  RESOURCE_GRAPH: "user-monitoring-resource-graph",
  /** 리소스 회수 정보 */
  RESOURCE_RECOVERY: "user-monitoring-resource-recovery",
  /** 워크로드 상태 정보 */
  WORKLOAD_STATUS: "user-monitoring-workload-status",
  /** 사용 자원 정보 */
  RESOURCE_USAGE: "user-monitoring-resource-usage",
  /** 실행 중 워크로드 목록 */
  RUNNING_WORKLOAD_LIST: "user-monitoring-running-workload-list",
  /** 리소스 회수 예정 목록 */
  RECOVERY_WORKLOAD_LIST: "user-monitoring-recovery-workload-list",

  // 워크로드 상태 카운트
  /** 상태별 건수 - workload-status-{status}-count */
  statusCount: (status: string) => `workload-status-${status}-count`,
} as const;

// ============================================
// 워크스페이스 (Workspace)
// ============================================

export const WORKSPACE_TEST_ID = {
  /** 선택된 워크스페이스 값 */
  SELECT_VALUE: "workspace-select-value",
  /** 워크스페이스 미선택 placeholder */
  SELECT_PLACEHOLDER: "workspace-select-placeholder",
} as const;

// ============================================
// 셀렉터 헬퍼 함수
// ============================================

/**
 * data-testid 속성 셀렉터 생성
 * @param testId - data-testid 값
 * @returns Playwright 셀렉터 문자열
 *
 * @example
 * selector(WORKLOAD_TEST_ID.LOG_BUTTON) // '[data-testid="workload-log-button"]'
 * selector(WORKLOAD_TEST_ID.name(123)) // '[data-testid="workload-name-123"]'
 */
export const selector = (testId: string): string => `[data-testid="${testId}"]`;

/**
 * data-testid prefix 셀렉터 생성 (동적 ID용)
 * @param prefix - data-testid prefix
 * @returns Playwright 셀렉터 문자열
 *
 * @example
 * selectorPrefix("workload-name-") // '[data-testid^="workload-name-"]'
 */
export const selectorPrefix = (prefix: string): string =>
  `[data-testid^="${prefix}"]`;

// ============================================
// 통합 내보내기
// ============================================

export const TEST_ID = {
  shared: SHARED_TEST_ID,
  workload: WORKLOAD_TEST_ID,
  userMonitoring: USER_MONITORING_TEST_ID,
  workspace: WORKSPACE_TEST_ID,
} as const;
