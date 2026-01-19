/**
 * 애플리케이션 라우트 경로 상수
 * - 정적 경로: 문자열로 정의
 * - 동적 경로: 함수로 정의 (타입 안전한 파라미터 전달)
 * - 경로 이름에 ADMIN_, USER_ prefix로 명확히 구분
 */

// 기본 모드 경로
export const MODE = {
  ADMIN: "/admin",
  USER: "/user",
} as const;

// 공통 액션
export const ACTIONS = {
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  UPDATE: "update",
} as const;

export const ROUTES = {
  // ============================================
  // Admin Routes
  // ============================================

  // 모니터링 (정적)
  ADMIN_MONITORING: `${MODE.ADMIN}/monitoring`,
  ADMIN_KUBERNETES_MONITORING: `${MODE.ADMIN}/kubernetes-monitoring`,
  ADMIN_SYSTEM_MONITORING: `${MODE.ADMIN}/system-monitoring`,
  ADMIN_MONITORING_NOTIFICATION: `${MODE.ADMIN}/monitoring-notification`,

  // 노드 관리 (동적 함수)
  ADMIN_NODE: `${MODE.ADMIN}/node`,
  ADMIN_NODE_DETAIL: (name: string) => `${MODE.ADMIN}/node/${name}`,
  ADMIN_NODE_LOG: (name: string) => `${MODE.ADMIN}/node/${name}/log`,
  ADMIN_NODE_REDFISH: (name: string) => `${MODE.ADMIN}/node/${name}/redfish`,

  // 계정 관리 (정적)
  ADMIN_ACCOUNT_MANAGEMENT: `${MODE.ADMIN}/account-management`,
  ADMIN_ACCOUNT_MANAGEMENT_PENDING: `${MODE.ADMIN}/account-management/pending`,
  ADMIN_ACCOUNT_MANAGEMENT_GROUP: `${MODE.ADMIN}/account-management/group`,

  // 보안 관리 (동적 함수)
  ADMIN_REGISTRY_SECURITY: `${MODE.ADMIN}/registry-security`,
  ADMIN_REGISTRY_SECURITY_TAG: (tagId: number, imageId: number) =>
    `${MODE.ADMIN}/registry-security/${tagId}?imageId=${imageId}`,
  ADMIN_FILE_SECURITY: `${MODE.ADMIN}/file-security`,
  ADMIN_FILE_SECURITY_SCAN: (scanId: number) =>
    `${MODE.ADMIN}/file-security/${scanId}`,
  ADMIN_FILE_SECURITY_VULNERABILITY: (
    scanId: number,
    vulnerabilityId: number,
  ) => `${MODE.ADMIN}/file-security/${scanId}/vulnerability/${vulnerabilityId}`,

  // 워크스페이스 관리 (동적 함수)
  ADMIN_WORKSPACE: `${MODE.ADMIN}/workspace`,
  ADMIN_WORKSPACE_DETAIL: (id: string) => `${MODE.ADMIN}/workspace/${id}`,
  ADMIN_WORKSPACE_MEMBER: (id: string) =>
    `${MODE.ADMIN}/workspace/${id}/member`,
  ADMIN_WORKSPACE_DISABLED: (id: string) =>
    `${MODE.ADMIN}/workspace/${id}/disabled`,
  ADMIN_WORKSPACE_WORKLOAD_DETAIL: (workspaceId: string, id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}?workspaceId=${workspaceId}`,
  ADMIN_WORKSPACE_WORKLOAD_LOG: (id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}/log`,
  ADMIN_WORKSPACE_WORKLOAD_FILE: (id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}/file`,
  ADMIN_WORKSPACE_WORKLOAD_MONITORING: (id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}/monitoring`,
  ADMIN_WORKSPACE_WORKLOAD_SECURITY: (id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}/security`,
  ADMIN_WORKSPACE_WORKLOAD_TERMINAL: (id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}/terminal`,

  ADMIN_REQUEST_RESOURCE: `${MODE.ADMIN}/request-resource`,
  ADMIN_REVOKE_RESOURCE_HISTORY: `${MODE.ADMIN}/revoke-history`,
  ADMIN_REVOKE_RESOURCE_HISTORY_DETAIL: (id: string) =>
    `${MODE.ADMIN}/revoke-history/${id}`,

  // 리소스 프리셋 관리 (동적 함수)
  ADMIN_RESOURCE_PRESET: `${MODE.ADMIN}/resource-preset`,
  ADMIN_RESOURCE_PRESET_DETAIL: (id: string) =>
    `${MODE.ADMIN}/resource-preset/${id}`,

  // 레지스트리 (동적 함수 - 복수 파라미터)
  ADMIN_REGISTRY: `${MODE.ADMIN}/registry`,
  ADMIN_EXTERNAL_REGISTRY: `${MODE.ADMIN}/external-registry`,
  ADMIN_REQUEST_IMAGE: `${MODE.ADMIN}/request-image`,

  // 소스코드 관리 (정적)
  ADMIN_SOURCECODE_MANAGEMENT: `${MODE.ADMIN}/sourcecode-management`,

  // 볼륨 관리 (동적 함수)
  ADMIN_VOLUME: `${MODE.ADMIN}/volume`,
  ADMIN_VOLUME_DETAIL: (id: number) => `${MODE.ADMIN}/volume/${id}`,

  // 리포트 관리 (동적 함수)
  ADMIN_REPORT: `${MODE.ADMIN}/report`,
  ADMIN_REPORT_DETAIL: (id: string) => `${MODE.ADMIN}/report/${id}`,
  ADMIN_REPORT_RESERVATION: `${MODE.ADMIN}/report-reservation`,
  ADMIN_REPORT_RESERVATION_DISPATCH_DETAIL: (id: string | number) =>
    `${MODE.ADMIN}/report-reservation/${id}`,

  // 설정 (정적)
  ADMIN_SETTING: `${MODE.ADMIN}/setting`,
  ADMIN_NOTIFICATION: `${MODE.ADMIN}/notification`,
  ADMIN_NOTIFICATION_DETAIL: (id: string | number) =>
    `${MODE.ADMIN}/notification/${id}`,

  // ============================================
  // User Routes
  // ============================================

  USER_MONITORING: `${MODE.USER}/monitoring`,

  // 워크로드 (동적 함수)
  USER_WORKLOAD: `${MODE.USER}/workload`,
  USER_WORKLOAD_DISABLED: `${MODE.USER}/workload/disabled`,
  USER_WORKLOAD_DETAIL: (id: string) => `${MODE.USER}/workload/${id}`,
  USER_WORKLOAD_LOG: (id: string) => `${MODE.USER}/workload/${id}/log`,
  USER_WORKLOAD_FILE: (id: string) => `${MODE.USER}/workload/${id}/file`,
  USER_WORKLOAD_MONITORING: (id: string) =>
    `${MODE.USER}/workload/${id}/monitoring`,
  USER_WORKLOAD_SECURITY: (id: string) =>
    `${MODE.USER}/workload/${id}/security`,
  USER_WORKLOAD_TERMINAL: (id: string) =>
    `${MODE.USER}/workload/${id}/terminal`,

  // 레지스트리 (동적 함수 - 복수 파라미터)
  USER_PRIVATE_REGISTRY: `${MODE.USER}/private-registry`,
  USER_PRIVATE_REGISTRY_DETAIL: (name: string) =>
    `${MODE.USER}/private-registry/${name}`,
  USER_PRIVATE_REGISTRY_TAG: (name: string, tagId: string) =>
    `${MODE.USER}/private-registry/${name}/${tagId}`,

  // 소스코드 (동적 함수)
  USER_SOURCECODE: `${MODE.USER}/sourcecode`,
  USER_SOURCECODE_DETAIL: (id: string) => `${MODE.USER}/sourcecode/${id}`,

  // 볼륨 (동적 함수)
  USER_VOLUME: `${MODE.USER}/volume`,
  USER_VOLUME_DETAIL: (id: number) => `${MODE.USER}/volume/${id}`,

  // 허브 (동적 함수)
  USER_HUB: `${MODE.USER}/hub`,
  USER_HUB_DETAIL: (id: number | string, name?: string) =>
    name
      ? `${MODE.USER}/hub/${id}?name=${encodeURIComponent(name)}`
      : `${MODE.USER}/hub/${id}`,

  // 설정 (정적)
  USER_SETTING: `${MODE.USER}/setting`,

  // ============================================
  // Auth Routes
  // ============================================
  AUTH_SIGNIN: "/signin",
  AUTH_SIGNUP: "/signup",

  // ============================================
  // Error Routes
  // ============================================
  WORKSPACE_ERROR: "/workspace-error",
} as const;
