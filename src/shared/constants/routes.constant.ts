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
  ADMIN_CLUSTER_MONITORING: `${MODE.ADMIN}/cluster-monitoring`,
  ADMIN_SYSTEM_MONITORING: `${MODE.ADMIN}/system-monitoring`,
  ADMIN_MONITORING_NOTIFICATION: `${MODE.ADMIN}/monitoring-notification`,

  // 노드 관리 (동적 함수)
  ADMIN_NODE: `${MODE.ADMIN}/node`,
  ADMIN_NODE_DETAIL: (name: string) => `${MODE.ADMIN}/node/${name}`,
  ADMIN_NODE_LOG: (name: string) => `${MODE.ADMIN}/node/${name}/log`,
  ADMIN_NODE_REDFISH: (name: string) => `${MODE.ADMIN}/node/${name}/redfish`,

  // 보안 관리 (정적)
  ADMIN_REGISTRY_SECURITY: `${MODE.ADMIN}/registry-security`,
  ADMIN_FILE_SECURITY: `${MODE.ADMIN}/file-security`,

  // 워크스페이스 관리 (동적 함수)
  ADMIN_WORKSPACE: `${MODE.ADMIN}/workspace`,
  ADMIN_WORKSPACE_DETAIL: (id: string) => `${MODE.ADMIN}/workspace/${id}`,
  ADMIN_WORKSPACE_MEMBER: (id: string) =>
    `${MODE.ADMIN}/workspace/${id}/member`,
  ADMIN_WORKSPACE_REQUEST_RESOURCE: `${MODE.ADMIN}/workspace/request-resource`,
  ADMIN_WORKSPACE_WORKLOAD_DETAIL: (id: string) =>
    `${MODE.ADMIN}/workspace/workload/${id}`,
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

  // 레지스트리 (동적 함수 - 복수 파라미터)
  ADMIN_REGISTRY: `${MODE.ADMIN}/registry`,
  ADMIN_PRIVATE_REGISTRY: `${MODE.ADMIN}/private-registry`,
  ADMIN_PRIVATE_REGISTRY_IMAGE: (name: string, id: string) =>
    `${MODE.ADMIN}/private-registry/${name}/image/${id}`,
  ADMIN_REQUEST_IMAGE: `${MODE.ADMIN}/request-image`,

  // 기타 (정적)
  ADMIN_REPORT: `${MODE.ADMIN}/report`,
  ADMIN_REQUEST_RESOURCE: `${MODE.ADMIN}/request-resource`,
  ADMIN_NOTIFICATION: `${MODE.ADMIN}/notification`,

  // 설정 (정적)
  ADMIN_SETTING: `${MODE.ADMIN}/setting`,
  ADMIN_USER: `${MODE.ADMIN}/user`,
  ADMIN_USER_PENDING: `${MODE.ADMIN}/user/pending`,
  ADMIN_USER_GROUP: `${MODE.ADMIN}/user/group`,

  // ============================================
  // User Routes
  // ============================================

  USER_MONITORING: `${MODE.USER}/monitoring`,

  // 워크로드 (동적 함수)
  USER_WORKLOAD: `${MODE.USER}/workload`,
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
  USER_PRIVATE_REGISTRY_IMAGE: `${MODE.USER}/private-registry-image`,
  USER_PRIVATE_REGISTRY_IMAGE_DETAIL: (id: string) =>
    `${MODE.USER}/private-registry-image/${id}`,
  USER_PRIVATE_REGISTRY_IMAGE_TAG: (id: string, tagId: string) =>
    `${MODE.USER}/private-registry-image/${id}/tag/${tagId}`,

  // 소스코드 (동적 함수)
  USER_SOURCECODE: `${MODE.USER}/sourcecode`,
  USER_SOURCECODE_DETAIL: (id: string) => `${MODE.USER}/sourcecode/${id}`,

  // 볼륨 (정적)
  USER_VOLUME: `${MODE.USER}/volume`,

  // 허브 (정적)
  USER_HUB: `${MODE.USER}/hub`,

  // 설정 (정적)
  USER_SETTING: `${MODE.USER}/setting`,

  // ============================================
  // Auth Routes
  // ============================================
  AUTH_SIGNIN: "/signin",
} as const;
