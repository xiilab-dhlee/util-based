/** 목록 페이지 크기 */
export const KUBERNETES_RESOURCE_LIST_PAGE_SIZE = 15;

type KubernetesStatusOption = {
  label: string;
  value: string;
};

type FilterOptionItem = {
  readonly label: string;
  readonly value: string;
};

type FilterConfigEnabled = {
  readonly hasFilter: true;
  readonly filterKey: string;
  readonly filterLabel: string;
  readonly options: readonly FilterOptionItem[];
};

type FilterConfigDisabled = {
  readonly hasFilter: false;
};

type FilterConfig = FilterConfigEnabled | FilterConfigDisabled;

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
  "PersistentVolume",
  "Namespaces",
  "Deployments",
  "Statefulsets",
  "Pods",
] as const;

export type KubernetesResourceName = (typeof KUBERNETES_RESOURCE_NAMES)[number];

/**
 * 리소스 타입별 필터 옵션 설정
 * - hasFilter: 필터 드롭다운 표시 여부
 * - filterKey: API 쿼리에 사용될 필터 키
 * - filterLabel: 드롭다운 placeholder 텍스트
 * - options: 필터 옵션 목록
 */
export const KUBERNETES_RESOURCE_FILTER_OPTIONS: Record<
  KubernetesResourceName,
  FilterConfig
> = {
  Nodes: {
    hasFilter: true,
    filterKey: "status",
    filterLabel: "상태",
    options: [
      { label: "Ready", value: "Ready" },
      { label: "Not Ready", value: "NotReady" },
    ],
  },
  Service: {
    hasFilter: true,
    filterKey: "type",
    filterLabel: "타입",
    options: [
      { label: "Cluster IP", value: "ClusterIP" },
      { label: "Node Port", value: "NodePort" },
      { label: "Load Balancer", value: "LoadBalancer" },
      { label: "External Name", value: "ExternalName" },
    ],
  },
  Daemonsets: {
    hasFilter: false,
  },
  PersistentVolume: {
    hasFilter: true,
    filterKey: "status",
    filterLabel: "상태",
    options: [
      { label: "Available", value: "Available" },
      { label: "Bound", value: "Bound" },
      { label: "Released", value: "Released" },
      { label: "Failed", value: "Failed" },
    ],
  },
  Namespaces: {
    hasFilter: true,
    filterKey: "status",
    filterLabel: "상태",
    options: [
      { label: "Active", value: "Active" },
      { label: "Terminating", value: "Terminating" },
    ],
  },
  Deployments: {
    hasFilter: true,
    filterKey: "conditions",
    filterLabel: "조건",
    options: [
      { label: "Available", value: "Available" },
      { label: "Progressing", value: "Progressing" },
    ],
  },
  Statefulsets: {
    hasFilter: false,
  },
  Pods: {
    hasFilter: true,
    filterKey: "status",
    filterLabel: "상태",
    options: [
      { label: "Pending", value: "Pending" },
      { label: "Running", value: "Running" },
      { label: "Succeeded", value: "Succeeded" },
      { label: "Failed", value: "Failed" },
      { label: "Unknown", value: "Unknown" },
    ],
  },
};

/**
 * 백엔드 값을 UI 표시용 라벨로 변환하는 헬퍼 함수
 * - 테이블 컬럼, 필터 드롭다운 등에서 사용
 * @example getFieldDisplayValue("Nodes", "NotReady") // "Not Ready"
 * @example getFieldDisplayValue("Service", "ClusterIP") // "Cluster IP"
 */
export const getFieldDisplayValue = (
  resourceName: KubernetesResourceName,
  value: string,
): string => {
  const filterConfig = KUBERNETES_RESOURCE_FILTER_OPTIONS[resourceName];
  if (!filterConfig.hasFilter) return value;

  const option = filterConfig.options.find((opt) => opt.value === value);
  return option?.label ?? value;
};

/**
 * 리소스 타입별 검색 설정
 * - searchKey: 검색 대상 필드
 * - placeholder: 검색 입력창 placeholder 텍스트
 */
export const KUBERNETES_RESOURCE_SEARCH_CONFIG = {
  Nodes: { searchKey: "resourceName", placeholder: "name을 입력해 주세요." },
  Service: {
    searchKey: "namespace",
    placeholder: "Namespace를 입력해 주세요.",
  },
  Daemonsets: { searchKey: "namespace", placeholder: "Namespace 검색" },
  PersistentVolume: {
    searchKey: "resourceName",
    placeholder: "name을 입력해 주세요.",
  },
  Namespaces: {
    searchKey: "resourceName",
    placeholder: "name을 입력해 주세요.",
  },
  Deployments: {
    searchKey: "namespace",
    placeholder: "Namespace를 입력해 주세요.",
  },
  Statefulsets: {
    searchKey: "namespace",
    placeholder: "Namespace를 입력해 주세요.",
  },
  Pods: { searchKey: "namespace", placeholder: "Namespace를 입력해 주세요." },
} as const;
