/**
 * data-testid 셀렉터 상수
 *
 * E2E 테스트와 컴포넌트에서 공통으로 사용합니다.
 * docs/data-testid-registry.md 문서와 동기화하여 관리합니다.
 *
 * 네이밍 컨벤션:
 * - {도메인}-{컴포넌트}-{역할}
 * - {도메인}-{컴포넌트}-{id}
 */

// ============================================
// 공통 (Shared)
// ============================================

export const SELECTOR = {
  // 목록 페이지 공통
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

  // 워크스페이스
  /** 선택된 워크스페이스 값 */
  WORKSPACE_SELECT_VALUE: "workspace-select-value",
  /** 워크스페이스 미선택 placeholder */
  WORKSPACE_SELECT_PLACEHOLDER: "workspace-select-placeholder",
} as const;

// ============================================
// 워크로드 (Workload)
// ============================================

export const WORKLOAD_SELECTOR = {
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

  // 검색 폼
  /** 비활성화 워크로드 검색 폼 */
  DISABLED_LIST_SEARCH_FORM: "workload-disabled-list-search-form",

  // 로그 페이지
  /** 로그 페이지 컨테이너 */
  LOG_PAGE: "workload-log-page",
  /** 로그 뷰어 영역 */
  LOG_VIEWER: "workload-log-viewer",
  /** 로그 라인 */
  LOG_LINE: "workload-log-line",
  /** 모니터링 버튼 (로그 페이지 상단) */
  LOG_MONITORING_BUTTON: "workload-log-monitoring-button",
  /** 테마 변경 버튼 */
  LOG_THEME_BUTTON: "workload-log-theme-button",

  // 웹터미널 페이지
  /** 웹터미널 페이지 컨테이너 */
  TERMINAL_PAGE: "workload-terminal-page",
  /** 웹터미널 영역 (xterm) */
  TERMINAL_CONTAINER: "workload-terminal-container",
  /** 모니터링 버튼 (웹터미널 페이지 상단) */
  TERMINAL_MONITORING_BUTTON: "workload-terminal-monitoring-button",
  /** 테마 변경 버튼 (웹터미널 페이지) */
  TERMINAL_THEME_BUTTON: "workload-terminal-theme-button",

  // 모니터링 페이지
  /** 모니터링 컨텐츠 영역 */
  MONITORING_CONTENT: "workload-monitoring-content",
  /** 모니터링 차트 카드 (동적) - workload-monitoring-chart-{type} */
  monitoringChart: (type: string) => `workload-monitoring-chart-${type}`,

  // 상세 페이지 - 좌측 요약 패널
  /** 상세 페이지 컨테이너 */
  DETAIL_PAGE: "workload-detail-page",
  /** 좌측 요약 패널 */
  DETAIL_ASIDE: "workload-detail-aside",
  /** 워크로드 이름 (상세) */
  DETAIL_NAME: "workload-detail-name",
  /** 워크로드 설명 */
  DETAIL_DESCRIPTION: "workload-detail-description",
  /** 수정 버튼 (상세) */
  DETAIL_EDIT_BUTTON: "workload-detail-edit-button",
  /** 종료 버튼 (상세) */
  DETAIL_STOP_BUTTON: "workload-detail-stop-button",
  /** 재시작 버튼 (상세) */
  DETAIL_RESTART_BUTTON: "workload-detail-restart-button",
  /** 삭제 버튼 (상세) */
  DETAIL_DELETE_BUTTON: "workload-detail-delete-button",

  // 상세 페이지 - 이벤트 이력
  /** 이벤트 이력 섹션 */
  DETAIL_EVENT_SECTION: "workload-detail-event-section",
  /** 이벤트 카드 prefix - workload-event-card-{index} */
  eventCard: (index: number) => `workload-event-card-${index}`,
  /** 이벤트 이름 */
  EVENT_NAME: "workload-event-name",
  /** 이벤트 상태 */
  EVENT_STATUS: "workload-event-status",
  /** 이벤트 경과 시간 */
  EVENT_ELAPSED_TIME: "workload-event-elapsed-time",
  /** 이벤트 From */
  EVENT_FROM: "workload-event-from",
  /** 이벤트 메시지 */
  EVENT_MESSAGE: "workload-event-message",

  // 상세 페이지 - 상세정보 탭 내용
  /** Job 정보 영역 */
  DETAIL_JOB_INFO: "workload-detail-job-info",
  /** Job Type 영역 */
  DETAIL_JOB_TYPE: "workload-detail-job-type",
  /** 노드 타입 영역 */
  DETAIL_NODE_TYPE: "workload-detail-node-type",
  /** 이미지 섹션 */
  DETAIL_IMAGE_SECTION: "workload-detail-image-section",
  /** 이미지 이름 */
  DETAIL_IMAGE_NAME: "workload-detail-image-name",
  /** Commit Image 생성 버튼 */
  DETAIL_COMMIT_IMAGE_BUTTON: "workload-detail-commit-image-button",
  /** 리소스 섹션 */
  DETAIL_RESOURCE_SECTION: "workload-detail-resource-section",
  /** 선택한 GPU */
  DETAIL_GPU_SELECTION: "workload-detail-gpu-selection",
  /** GPU 리소스 값 */
  DETAIL_RESOURCE_GPU: "workload-detail-resource-gpu",
  /** CPU 리소스 값 */
  DETAIL_RESOURCE_CPU: "workload-detail-resource-cpu",
  /** Memory 리소스 값 */
  DETAIL_RESOURCE_MEMORY: "workload-detail-resource-memory",
  /** 생성자 정보 */
  DETAIL_CREATOR: "workload-detail-creator",
  /** 생성일 */
  DETAIL_CREATED_DATE: "workload-detail-created-date",
} as const;

// ============================================
// 사용자 모니터링 (User Monitoring)
// ============================================

export const USER_MONITORING_SELECTOR = {
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

  // 워크로드 상태
  /** 상태 컨테이너 - monitoring-workload-status-{status} */
  status: (status: string) => `monitoring-workload-status-${status}`,
  /** 상태별 건수 - monitoring-workload-status-{status}-count */
  statusCount: (status: string) => `monitoring-workload-status-${status}-count`,
} as const;

// ============================================
// 테스트용 헬퍼 함수
// ============================================

/**
 * data-testid 속성 셀렉터 생성
 * @param id - data-testid 값
 * @returns Playwright 셀렉터 문자열
 *
 * @example
 * testId(WORKLOAD_SELECTOR.LOG_BUTTON) // '[data-testid="workload-log-button"]'
 */
export const testId = (id: string): string => `[data-testid="${id}"]`;

/**
 * data-testid prefix 셀렉터 생성 (동적 ID용)
 * @param prefix - data-testid prefix
 * @returns Playwright 셀렉터 문자열
 *
 * @example
 * testIdPrefix("workload-name-") // '[data-testid^="workload-name-"]'
 */
export const testIdPrefix = (prefix: string): string =>
  `[data-testid^="${prefix}"]`;
