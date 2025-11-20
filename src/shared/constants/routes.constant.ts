/**
 * 애플리케이션 라우트 경로 상수
 * - 정적 경로: 문자열로 정의
 * - 동적 경로: 함수로 정의 (타입 안전한 파라미터 전달)
 * - 경로 이름에 ADMIN_, STANDARD_ prefix로 명확히 구분
 */

// 기본 모드 경로
export const MODE = {
  ADMIN: "/admin",
  STANDARD: "/standard",
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
  // Standard Routes
  // ============================================

  STANDARD_DASHBOARD: `${MODE.STANDARD}/dashboard`,

  // 워크로드 (동적 함수)
  STANDARD_WORKLOAD: `${MODE.STANDARD}/workload`,
  STANDARD_WORKLOAD_DETAIL: (id: string) => `${MODE.STANDARD}/workload/${id}`,
  STANDARD_WORKLOAD_LOG: (id: string) => `${MODE.STANDARD}/workload/${id}/log`,
  STANDARD_WORKLOAD_FILE: (id: string) =>
    `${MODE.STANDARD}/workload/${id}/file`,
  STANDARD_WORKLOAD_MONITORING: (id: string) =>
    `${MODE.STANDARD}/workload/${id}/monitoring`,
  STANDARD_WORKLOAD_SECURITY: (id: string) =>
    `${MODE.STANDARD}/workload/${id}/security`,
  STANDARD_WORKLOAD_TERMINAL: (id: string) =>
    `${MODE.STANDARD}/workload/${id}/terminal`,

  // 레지스트리 (동적 함수 - 복수 파라미터)
  STANDARD_PRIVATE_REGISTRY_IMAGE: `${MODE.STANDARD}/private-registry-image`,
  STANDARD_PRIVATE_REGISTRY_IMAGE_DETAIL: (id: string) =>
    `${MODE.STANDARD}/private-registry-image/${id}`,
  STANDARD_PRIVATE_REGISTRY_IMAGE_TAG: (id: string, tagId: string) =>
    `${MODE.STANDARD}/private-registry-image/${id}/tag/${tagId}`,

  // 소스코드 (동적 함수)
  STANDARD_SOURCECODE: `${MODE.STANDARD}/sourcecode`,
  STANDARD_SOURCECODE_DETAIL: (id: string) =>
    `${MODE.STANDARD}/sourcecode/${id}`,

  // 볼륨 (정적)
  STANDARD_VOLUME: `${MODE.STANDARD}/volume`,

  // 허브 (정적)
  STANDARD_HUB: `${MODE.STANDARD}/hub`,

  // 설정 (정적)
  STANDARD_SETTING: `${MODE.STANDARD}/setting`,
} as const;
