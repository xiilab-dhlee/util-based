/** 목록 페이지 크기 */
export const KUBERNETES_RESOURCE_LIST_PAGE_SIZE = 15;

type KubernetesStatusOption = {
  label: string;
  value: string;
};

/**
 * Kubernetes 리소스 리스트 상태 필터 옵션
 * - 추후 상태가 추가될 경우 이 배열만 확장하면 됩니다.
 */
export const KUBERNETES_RESOURCE_STATUS_FILTER_OPTIONS = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Running",
    value: "running",
  },
] as const satisfies readonly KubernetesStatusOption[];

export type KubernetesResourceStatusValue =
  (typeof KUBERNETES_RESOURCE_STATUS_FILTER_OPTIONS)[number]["value"];

/**
 * Kubernetes 이벤트 상태 코드 상수
 * - 서버/도메인에서 사용하는 영문 상태 코드
 */
export const KUBERNETES_EVENT_STATUS = {
  ERROR: "error",
  WARNING: "warning",
  NORMAL: "normal",
} as const;

export type KubernetesEventStatus =
  (typeof KUBERNETES_EVENT_STATUS)[keyof typeof KUBERNETES_EVENT_STATUS];

/**
 * Kubernetes 이벤트 상태 코드 → 한글 라벨 매핑
 * - 화면에 표시되는 텍스트
 */
export const KUBERNETES_EVENT_STATUS_LABEL: Record<
  KubernetesEventStatus,
  string
> = {
  [KUBERNETES_EVENT_STATUS.ERROR]: "에러",
  [KUBERNETES_EVENT_STATUS.WARNING]: "주의",
  [KUBERNETES_EVENT_STATUS.NORMAL]: "정상",
};

/**
 * Kubernetes 리소스 이름 상수
 * - Aside 카드 및 리소스 목록 API 의 resourceName 으로 사용됩니다.
 */
export const KUBERNETES_RESOURCE_NAMES = [
  "Nodes",
  "Service",
  "Daemonsets",
  "Containers",
  "PersistentVolume",
  "Namespaces",
  "Deployments",
  "Statefulsets",
  "Pods",
  "HPAs",
] as const;

export type KubernetesResourceName = (typeof KUBERNETES_RESOURCE_NAMES)[number];
