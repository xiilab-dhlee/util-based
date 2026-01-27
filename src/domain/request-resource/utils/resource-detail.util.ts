import type {
  AdminResourceRequestDetailResponse,
  ResourceComparisonResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { convertBytes } from "@/shared/utils/resource.util";

/**
 * 리소스 에러 타입
 */
export type ResourceErrorType = "CAPACITY_EXCEEDED" | "MIG_NOT_FOUND";

/**
 * 클러스터 최대값 인터페이스
 */
export interface ClusterMaxValues {
  gpuMax: number;
  cpuMax: number;
  memMax: number;
  migProfileMaxMap: Map<string, number>;
}

/**
 * 요청 리소스 모달에서 사용되는 리소스 타입
 */
type BaseRequestResource = {
  displayTitle: string;
  current: number;
  req: number;
  max: number;
  hasError: boolean; // 용량 초과 여부
  errorType?: ResourceErrorType; // 에러 타입
};

type StandardRequestResource = BaseRequestResource & {
  type: "GPU" | "CPU" | "MEM";
};

type MigRequestResource = BaseRequestResource & {
  type: "MIG";
  profile: string;
};

export type RequestResourceModalResource =
  | StandardRequestResource
  | MigRequestResource;

/**
 * 리소스 비교 데이터에서 요청량과 현재 할당량을 추출
 */
export function extractResourceValues(resource: ResourceComparisonResponse) {
  return {
    // GPU
    gpuQuota: resource.gpu?.detail.normal?.quotaCount ?? 0, // 현재 할당량
    gpuRequest: resource.gpu?.detail.normal?.requestCount ?? 0, // 요청량

    // CPU
    cpuQuota: resource.cpu.quotaCore, // 현재 할당량
    cpuRequest: resource.cpu.requestCore, // 요청량

    // Memory (Byte → GB 변환)
    memQuota: convertBytes(resource.memory.quotaByte, "GB", 0).value, // 현재 할당량
    memRequest: convertBytes(resource.memory.requestByte, "GB", 0).value, // 요청량

    // MIG
    migProfiles: resource.gpu?.detail.mig ?? [],
  };
}

/**
 * Slider max 값 계산 (클러스터 전체 용량 사용)
 */
export function calculateResourceMax(resource: ResourceComparisonResponse) {
  return {
    gpuMax: resource.gpu?.detail.normal?.clusterCapacityCount ?? 100,
    cpuMax: resource.cpu.clusterCapacityCore,
    memMax: convertBytes(resource.memory.clusterCapacityByte, "GB", 0).value,
  };
}

/**
 * 요청 리소스 모달용 리소스 데이터 변환
 */
export function transformToRequestResourceModalData(
  detail: AdminResourceRequestDetailResponse,
  clusterMaxValues: ClusterMaxValues,
): {
  workspaceName: string;
  resources: RequestResourceModalResource[];
  errorSummary: {
    hasCapacityError: boolean;
    hasMigNotFoundError: boolean;
  };
} {
  const values = extractResourceValues(detail.resource);

  // GPU 리소스
  const gpuMax = clusterMaxValues.gpuMax;
  const gpuHasError = values.gpuRequest > gpuMax;
  const gpuResource = {
    type: "GPU",
    displayTitle: "GPU",
    current: values.gpuQuota,
    req: values.gpuRequest,
    max: gpuMax,
    hasError: gpuHasError,
    errorType: gpuHasError ? ("CAPACITY_EXCEEDED" as const) : undefined,
  } satisfies StandardRequestResource;

  // MIG 리소스들 (각 프로파일별로)
  const migResources = values.migProfiles.map((profile) => {
    const clusterMax = clusterMaxValues.migProfileMaxMap.get(profile.profile);
    const max = clusterMax ?? 0;
    const hasError = profile.requestCount > max;
    const errorType: ResourceErrorType | undefined = hasError
      ? clusterMax === undefined
        ? "MIG_NOT_FOUND"
        : "CAPACITY_EXCEEDED"
      : undefined;

    return {
      type: "MIG",
      displayTitle: `MIG | ${profile.profile}`,
      profile: profile.profile,
      current: profile.quotaCount,
      req: profile.requestCount,
      max,
      hasError,
      errorType,
    } satisfies MigRequestResource;
  });

  // CPU 리소스
  const cpuMax = clusterMaxValues.cpuMax;
  const cpuHasError = values.cpuRequest > cpuMax;
  const cpuResource = {
    type: "CPU",
    displayTitle: "CPU",
    current: values.cpuQuota,
    req: values.cpuRequest,
    max: cpuMax,
    hasError: cpuHasError,
    errorType: cpuHasError ? ("CAPACITY_EXCEEDED" as const) : undefined,
  } satisfies StandardRequestResource;

  // Memory 리소스
  const memMax = clusterMaxValues.memMax;
  const memHasError = values.memRequest > memMax;
  const memResource = {
    type: "MEM",
    displayTitle: "Memory",
    current: values.memQuota,
    req: values.memRequest,
    max: memMax,
    hasError: memHasError,
    errorType: memHasError ? ("CAPACITY_EXCEEDED" as const) : undefined,
  } satisfies StandardRequestResource;

  // 순서: GPU → MIG → CPU → Memory
  const allResources = [gpuResource, ...migResources, cpuResource, memResource];

  // 요청량이 있는 것만 필터링
  const filteredResources = allResources.filter((r) => r.req > 0);

  // 에러 요약 생성
  const errorSummary = {
    hasCapacityError: filteredResources.some(
      (r) => r.errorType === "CAPACITY_EXCEEDED",
    ),
    hasMigNotFoundError: filteredResources.some(
      (r) => r.errorType === "MIG_NOT_FOUND",
    ),
  };

  return {
    workspaceName: detail.workspaceName,
    resources: filteredResources,
    errorSummary,
  };
}
