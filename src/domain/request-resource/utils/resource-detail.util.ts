import type {
  AdminResourceRequestDetailResponse,
  ResourceComparisonResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { convertBytes } from "@/shared/utils/resource.util";

/**
 * 요청 리소스 모달에서 사용되는 리소스 타입
 */
type BaseRequestResource = {
  displayTitle: string;
  current: number;
  req: number;
  max: number;
  hasError: boolean; // 용량 초과 여부
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
): {
  workspaceName: string;
  resources: RequestResourceModalResource[];
} {
  const values = extractResourceValues(detail.resource);
  const maxValues = calculateResourceMax(detail.resource);

  // GPU 리소스
  const gpuResource = {
    type: "GPU",
    displayTitle: "GPU",
    current: values.gpuQuota,
    req: values.gpuRequest,
    max: maxValues.gpuMax,
    hasError: values.gpuRequest > maxValues.gpuMax, // 용량 초과 검증
  } satisfies StandardRequestResource;

  // MIG 리소스들 (각 프로파일별로)
  const migResources = values.migProfiles.map(
    (profile) =>
      ({
        type: "MIG",
        displayTitle: `MIG | ${profile.profile}`,
        profile: profile.profile,
        current: profile.quotaCount,
        req: profile.requestCount,
        max: profile.clusterCapacityCount,
        hasError: profile.requestCount > profile.clusterCapacityCount, // 용량 초과 검증
      }) satisfies MigRequestResource,
  );

  // CPU 리소스
  const cpuResource = {
    type: "CPU",
    displayTitle: "CPU",
    current: values.cpuQuota,
    req: values.cpuRequest,
    max: maxValues.cpuMax,
    hasError: values.cpuRequest > maxValues.cpuMax, // 용량 초과 검증
  } satisfies StandardRequestResource;

  // Memory 리소스
  const memResource = {
    type: "MEM",
    displayTitle: "Memory",
    current: values.memQuota,
    req: values.memRequest,
    max: maxValues.memMax,
    hasError: values.memRequest > maxValues.memMax, // 용량 초과 검증
  } satisfies StandardRequestResource;

  // 순서: GPU → MIG → CPU → Memory
  return {
    workspaceName: detail.workspaceName,
    resources: [gpuResource, ...migResources, cpuResource, memResource].filter(
      (r) => r.req > 0,
    ), // 요청량이 있는 것만 표시
  };
}
