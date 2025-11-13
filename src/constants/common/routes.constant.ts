/**
 * 애플리케이션 라우트 경로 상수
 *
 * 프로젝트에서 사용되는 모든 경로를 도메인별로 관리합니다.
 */

// 액션 도메인
const actions = {
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  UPDATE: "update",
} as const;

// 모든 경로를 통합한 객체
const routes = {
  // 기본 모드 경로
  STANDARD: "standard",
  ADMIN: "admin",

  // 워크로드 도메인
  WORKLOAD: "workload",
  WORKLOAD_CREATE: `workload/${actions.CREATE}`,

  // 볼륨 도메인
  VOLUME: "volume",

  // 소스코드 도메인
  SOURCECODE: "sourcecode",

  // 레지스트리 도메인
  PUBLIC_REGISTRY: "public-registry",
  PRIVATE_REGISTRY: "private-registry",
  HUB: "hub",

  // 관리 도메인
  DASHBOARD: "dashboard",
  SERVICE: "service",
  MODEL: "model",
  COMPARE: "compare",
  MONITORING: "monitoring",
  SETTING: "setting",

  // 관리자 전용 도메인
  NODE: "node",
  WORKSPACE: "workspace",
  SCHEDULE: "schedule",
  REPORT: "report",

  // 모니터링 도메인
  MONITORING_SYSTEM: "monitoring-system",
  MONITORING_CLUSTER: "monitoring-cluster",
  MONITORING_SECURITY: "monitoring-security",
  MONITORING_NOTIFICATION: "monitoring-notification",

  // 레지스트리 관리
  REGISTRY_PUBLIC: "registry-public",
  REGISTRY_PRIVATE: "registry-private",
  REGISTRY_REQUEST: "registry-request",

  // 기타
  TERMINAL: "terminal",
} as const;

export default routes;
export { actions };
