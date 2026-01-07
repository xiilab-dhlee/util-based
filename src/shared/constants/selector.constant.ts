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
  // 목록 페이지 공통 (고정 상수)
  /** 목록 테이블 래퍼 */
  LIST_TABLE: "list-table",
  /** 카드 그리드 목록 (허브 등 카드형 목록) */
  LIST_CARD_GRID: "list-card-grid",
  /** 목록 카드 (카드형 목록의 개별 카드) */
  LIST_CARD: "list-card",
  /** 총 개수 표시 */
  LIST_TOTAL_COUNT: "list-total-count",
  /** 페이지네이션 */
  LIST_PAGINATION: "list-pagination",
  /** 검색 입력창 */
  LIST_SEARCH_INPUT: "list-search-input",
  /** 필터 영역 */
  LIST_FILTER: "list-filter",
  /** 내 항목만 보기 스위치 */
  MY_ITEMS_ONLY_SWITCH: "my-items-only-switch",

  // 워크스페이스
  /** 선택된 워크스페이스 값 */
  WORKSPACE_SELECT_VALUE: "workspace-select-value",
  /** 워크스페이스 미선택 placeholder */
  WORKSPACE_SELECT_PLACEHOLDER: "workspace-select-placeholder",

  // 모달 (Ant Design Modal 기반)
  /** 모달 컨테이너 (visible) */
  MODAL: ".ant-modal:visible",
  /** 모달 확인 버튼 (footer의 마지막 버튼) */
  MODAL_OK_BUTTON: ".ant-modal:visible .ant-modal-footer button:last-child",
  /** 모달 취소 버튼 (footer의 첫 번째 버튼) */
  MODAL_CANCEL_BUTTON:
    ".ant-modal:visible .ant-modal-footer button:first-child",

  // 드로어 (Ant Design Drawer 기반)
  /** 드로어 컨테이너 (열린 상태) */
  DRAWER: ".ant-drawer-open",
  /** 드로어 닫기 버튼 */
  DRAWER_CLOSE_BUTTON: ".ant-drawer-open .ant-drawer-close",

  // 테마 선택 (로그/웹터미널 공통)
  /** 테마 팝오버 컨테이너 */
  THEME_POPOVER: "theme-popover",
  THEME_BUTTON: "theme-button",
  /** 테마 옵션 (동적) - theme-option-{themeName} */
  themeOption: (themeName: string) => `theme-option-${themeName}`,
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

  // 목록 테이블 데이터
  /** 워크로드 이름 링크 */
  NAME: "workload-name",
  /** 잡 타입 텍스트 */
  JOB_TYPE: "workload-job-type",
  /** 워크로드 상태 (동적) - workload-status-{status} */
  status: (status: string) => `workload-status-${status}`,
  /** 경과 시간 */
  ELAPSED_TIME: "workload-elapsed-time",
  /** 생성자 이름 */
  CREATOR_NAME: "workload-creator-name",
  // 액션 버튼
  /** 로그 버튼 */
  LOG_BUTTON: "workload-log-button",
  /** 웹터미널 버튼 */
  TERMINAL_BUTTON: "workload-terminal-button",
  /** 모니터링 버튼 */
  MONITORING_BUTTON: "workload-monitoring-button",
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

  // 로그 페이지
  /** 로그 뷰어 영역 */
  LOG_VIEWER: "workload-log-viewer",
  /** 로그 라인 */
  LOG_LINE: "workload-log-line",
  /** 모니터링 버튼 */
  DETAIL_MONITORING_BUTTON: "workload-detail-monitoring-button",
  /** 테마 변경 버튼 */
  DETAIL_THEME_BUTTON: "workload-detail-theme-button",
  // 웹터미널 페이지
  /** 웹터미널 영역 (xterm) */
  TERMINAL_CONTAINER: "workload-terminal-container",
  /** 웹터미널 패널 (개별 터미널 노드) */
  TERMINAL_NODE: "workload-terminal-node",
  /** 웹터미널 수평 분할 버튼 */
  TERMINAL_SPLIT_HORIZONTAL_BUTTON: "workload-terminal-split-horizontal-button",
  /** 웹터미널 수직 분할 버튼 */
  TERMINAL_SPLIT_VERTICAL_BUTTON: "workload-terminal-split-vertical-button",

  // 모니터링 사이드 패널 (로그/웹터미널 공통)
  /** 모니터링 사이드 패널 컨테이너 */
  ASIDE_MONITORING: "workload-aside-monitoring",
  /** 모니터링 차트 카드 (공통) */
  MONITORING_CHART: "workload-monitoring-chart",
  /** 모니터링 차트 카드 (동적) - workload-monitoring-chart-{type} */
  monitoringChart: (type: string) => `workload-monitoring-chart-${type}`,
  /** 모니터링 차트 타이틀 */
  MONITORING_CHART_TITLE: "workload-monitoring-chart-title",
  /** 모니터링 차트 확대 버튼 */
  MONITORING_CHART_EXPAND_BUTTON: "workload-monitoring-chart-expand-button",

  // 상세 페이지 - 좌측 요약 패널
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
  /** 복제 버튼 (상세) */
  DETAIL_CLONE_BUTTON: "workload-detail-clone-button",

  // 상세 페이지 - 이벤트 이력
  /** 이벤트 카드 */
  EVENT_CARD: "workload-event-card",
  /** 이벤트 상태 - workload-event-status-{status} (상태별 필터링용) */
  eventStatus: (status: string) => `workload-event-status-${status}`,
  /** 이벤트 경과 시간 */
  EVENT_ELAPSED_TIME: "workload-event-elapsed-time",
  /** 이벤트 From */
  EVENT_FROM: "workload-event-from",
  /** 이벤트 메시지 */
  EVENT_MESSAGE: "workload-event-message",

  // 상세 페이지 - 소스코드
  /** 소스코드 카드 */
  SOURCECODE_CARD: "workload-source-code-card",
  /** 소스코드 기본 경로 */
  SOURCECODE_PATH: "workload-source-code-path",
  /** 소스코드 타입 - workload-source-code-type-{type} (타입별 필터링용) */
  sourcecodeType: (type: string) => `workload-source-code-type-${type}`,
  /** 소스코드 Git URL */
  SOURCECODE_URL: "workload-source-code-url",

  // 상세 페이지 - 볼륨
  /** 볼륨 카드 */
  VOLUME_CARD: "workload-volume-card",
  /** 볼륨 상태 - workload-volume-status-{status} (상태별 필터링용) */
  volumeStatus: (status: string) => `workload-volume-status-${status}`,
  /** 볼륨 스토리지 타입 - workload-volume-storage-type-{type} */
  volumeStorageType: (type: string) => `workload-volume-storage-type-${type}`,
  /** 볼륨 경로 */
  VOLUME_PATH: "workload-volume-path",
  /** 볼륨 크기 */
  VOLUME_SIZE: "workload-volume-size",

  // 상세 페이지 - 상세정보 탭 내용
  /** 잡 타입 명 */
  DETAIL_JOB_TYPE_NAME: "workload-detail-job-type-name",
  /** 잡 타입 IDE */
  DETAIL_JOB_TYPE_IDE: "workload-detail-job-type-ide",
  /** 노드 타입 명 */
  DETAIL_NODE_TYPE_NAME: "workload-detail-node-type-name",
  /** 이미지 타입 */
  DETAIL_IMAGE_TYPE: "workload-detail-image-type",
  /** 이미지 이름 */
  DETAIL_IMAGE_NAME: "workload-detail-image-name",
  /** Commit Image 생성 버튼 */
  DETAIL_COMMIT_IMAGE_BUTTON: "workload-detail-commit-image-button",

  // Commit Image 생성 모달
  /** Commit Image 이름 입력 */
  COMMIT_IMAGE_NAME_INPUT: "workload-commit-image-name-input",
  /** Commit Image 태그 입력 */
  COMMIT_IMAGE_TAG_INPUT: "workload-commit-image-tag-input",

  /** 보안검사 결과 */
  DETAIL_SECURITY_LEVEL_CRITICAL: "workload-detail-security-level-critical",
  DETAIL_SECURITY_LEVEL_HIGH: "workload-detail-security-level-high",
  DETAIL_SECURITY_LEVEL_MEDIUM: "workload-detail-security-level-medium",
  DETAIL_SECURITY_LEVEL_LOW: "workload-detail-security-level-low",
  /** 실행 경로 */
  DETAIL_EXEC_PATH: "workload-detail-exec-path",
  /** 실행 명령어 */
  DETAIL_EXEC_COMMAND: "workload-detail-exec-command",
  /** 환경변수 키 */
  ENV_KEY: "workload-env-key",
  /** 환경변수 값 */
  ENV_VALUE: "workload-env-value",
  /** 포트 이름 */
  PORT_NAME: "workload-port-name",
  /** 포트 번호 */
  PORT_VALUE: "workload-port-value",
  /** 접속 URL */
  PORT_URL: "workload-port-url",
  /** 선택한 GPU */
  DETAIL_GPU_TYPE: "workload-detail-gpu-type",
  DETAIL_GPU_NAME: "workload-detail-gpu-name",
  DETAIL_GPU_MEMORY_GB: "workload-detail-gpu-memory-gb",
  /** GPU 리소스 값 */
  DETAIL_GPU_COUNT: "workload-detail-gpu-count",
  /** CPU 리소스 값 */
  DETAIL_CPU_CORE: "workload-detail-cpu-core",
  /** Memory 리소스 값 */
  DETAIL_MEMORY_GB: "workload-detail-memory-gb",
  /** 생성자 정보 */
  DETAIL_CREATOR: "workload-detail-creator",
  /** 생성일 */
  DETAIL_CREATED_DATE: "workload-detail-created-date",

  // 생성 드로어
  /** 최근 워크로드 가져오기 버튼 */
  CREATE_RECENT_IMPORT_BUTTON: "workload-create-recent-import-button",
  /** 워크로드 목록에서 가져오기 버튼 */
  CREATE_LIST_IMPORT_BUTTON: "workload-create-list-import-button",
  /** 워크로드 이름 입력창 */
  CREATE_NAME: "workload-create-name",
  /** 워크로드 설명 입력창 */
  CREATE_DESCRIPTION: "workload-create-description",
  /** 워크로드 생성하기 버튼 */
  CREATE_BUTTON: "workload-create-button",

  // 수정 모달
  /** 수정 모달 이름 입력 */
  UPDATE_NAME_INPUT: "workload-update-name-input",
  /** 수정 모달 설명 입력 */
  UPDATE_DESCRIPTION_INPUT: "workload-update-description-input",
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
// 인증 (Auth)
// ============================================

export const AUTH_SELECTOR = {
  // 회원가입 페이지
  /** 회원가입 페이지 헤더 */
  SIGNUP_HEADER: "signup-header",

  // FormItem (라벨 + 입력 + 에러 메시지 컨테이너)
  /** 이메일 필드 (FormItem) */
  SIGNUP_EMAIL_FIELD: "signup-email-field",
  /** 비밀번호 필드 (FormItem) */
  SIGNUP_PASSWORD_FIELD: "signup-password-field",
  /** 비밀번호 확인 필드 (FormItem) */
  SIGNUP_CONFIRM_PASSWORD_FIELD: "signup-confirm-password-field",
  /** 이름 필드 (FormItem) */
  SIGNUP_FIRST_NAME_FIELD: "signup-first-name-field",
  /** 성 필드 (FormItem) */
  SIGNUP_LAST_NAME_FIELD: "signup-last-name-field",
  /** 그룹명 필드 (FormItem) */
  SIGNUP_GROUP_NAME_FIELD: "signup-group-name-field",

  // Input (실제 입력창)
  /** 이메일 입력창 */
  SIGNUP_EMAIL_INPUT: "signup-email-input",
  /** 비밀번호 입력창 */
  SIGNUP_PASSWORD_INPUT: "signup-password-input",
  /** 비밀번호 확인 입력창 */
  SIGNUP_CONFIRM_PASSWORD_INPUT: "signup-confirm-password-input",
  /** 이름 입력창 */
  SIGNUP_FIRST_NAME_INPUT: "signup-first-name-input",
  /** 성 입력창 */
  SIGNUP_LAST_NAME_INPUT: "signup-last-name-input",

  /** 회원가입 버튼 */
  SIGNUP_SUBMIT_BUTTON: "signup-submit-button",
  /** 로그인 링크 */
  SIGNUP_LOGIN_LINK: "signup-login-link",

  // 회원가입 성공 UI (signup 페이지 내)
  /** 회원가입 성공 컨테이너 */
  SIGNUP_SUCCESS_CONTAINER: "signup-success-container",
  /** 로그인 페이지로 이동 버튼 (회원가입 성공 후) */
  SIGNUP_GO_TO_LOGIN_BUTTON: "signup-go-to-login-button",
} as const;

// ============================================
// 허브 (Hub)
// ============================================

export const HUB_SELECTOR = {
  // 페이지 헤더
  /** 허브 목록 페이지 헤더 */
  PAGE_HEADER: "user.hub",

  // 목록 카드
  /** 허브 카드 */
  CARD: "hub-card",
  /** 허브 이름 */
  NAME: "hub-name",
  /** 허브 모델 타입 */
  MODEL_TYPE: "hub-model-type",
  /** 허브 설명 */
  DESCRIPTION: "hub-description",
  /** 허브 썸네일 이미지 */
  THUMBNAIL: "hub-thumbnail",

  // 상세 페이지
  /** 허브 상세 헤더 이름 */
  DETAIL_NAME: "hub-detail-name",
  /** 허브 README 콘텐츠 */
  DETAIL_README: "hub-detail-readme",
  /** 워크로드 생성 버튼 */
  CREATE_WORKLOAD_BUTTON: "hub-create-workload-button",
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
