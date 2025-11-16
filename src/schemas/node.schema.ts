import { z } from "zod";

// 노드 스키마
const baseNodeSchema = z.object({
  /** 노드 ID */
  id: z.string().uuid(),
  /** 노드 이름 */
  nodeName: z.string().min(1).max(100),
  /** IP 주소 */
  ip: z.string().ip(),
  /** 호스트명 */
  hostName: z.string().min(1).max(100),
  /** 역할 */
  role: z.string(),
  /** 생성 시간 */
  creationTimestamp: z.string().datetime(),
  /** 노드 컨디션 */
  nodeCondition: z.array(
    z.object({
      /** 마지막 하트비트 시간 */
      lastHeartbeatTime: z.string().datetime(),
      /** 마지막 전환 시간 */
      lastTransitionTime: z.string().datetime(),
      /** 메시지 */
      message: z.string(),
      /** 이유 */
      reason: z.string(),
      /** 상태 */
      status: z.string(),
      /** 타입 */
      type: z.string(),
    }),
  ),
  /** 노드 시스템 정보 */
  nodeSystemInfo: z.object({
    /** 아키텍처 */
    architecture: z.string(),
    /** 부트 ID */
    bootID: z.string(),
    /** 컨테이너 런타임 버전 */
    containerRuntimeVersion: z.string(),
    /** 커널 버전 */
    kernelVersion: z.string(),
    /** kube-proxy 버전 */
    kubeProxyVersion: z.string(),
    /** kubelet 버전 */
    kubeletVersion: z.string(),
    /** 머신 ID */
    machineID: z.string(),
    /** 운영체제 */
    operatingSystem: z.string(),
    /** OS 이미지 */
    osImage: z.string(),
    /** 시스템 UUID */
    systemUUID: z.string(),
  }),
  /** GPU 모델명 */
  modelName: z.string().min(1).max(100),
  /** GPU 개수 */
  gpuCount: z.number().int().min(1).max(100),
  /** GPU 사용률 */
  gpuPercent: z.number().int().min(1).max(100),
  /** CPU 사용률 */
  cpuPercent: z.number().int().min(1).max(100),
  /** 메모리 사용률 */
  memPercent: z.number().int().min(1).max(100),
  /** 디스크 사용률 */
  diskPercent: z.number().int().min(1).max(100),
  /** 경과 시간 */
  age: z.object({
    /** 일 */
    days: z.number().int().min(1).max(100),
    /** 시간 */
    hour: z.number().int().min(1).max(100),
    /** 분 */
    minutes: z.number().int().min(1).max(100),
  }),
  /** 상태 */
  status: z.boolean(),
});

export const nodeListSchema = baseNodeSchema.pick({
  id: true,
  nodeName: true,
  ip: true,
  modelName: true,
  gpuCount: true,
  gpuPercent: true,
  cpuPercent: true,
  memPercent: true,
  diskPercent: true,
  age: true,
  status: true,
});

export const nodeDetailSchema = baseNodeSchema;

// 노드 리소스 스키마
export const nodeResourcesSchema = z.object({
  /** GPU 타입 */
  gpuType: z.string().nullable(),
  /** GPU 개수 */
  gpuCount: z.number().nullable(),
  /** GPU 메모리 */
  gpuMem: z.string().nullable(),
  /** GPU 드라이버 버전 */
  gpuDriverVersion: z.string().nullable(),
  /** 용량 */
  capacity: z.object({
    /** CPU 용량 */
    capacityCpu: z.string(),
    /** 임시 스토리지 용량 */
    capacityEphemeralStorage: z.string(),
    /** Hugepages 1Gi 용량 */
    capacityHugepages1Gi: z.string(),
    /** Hugepages 2Mi 용량 */
    capacityHugepages2Mi: z.string(),
    /** 메모리 용량 */
    capacityMemory: z.string(),
    /** Pod 용량 */
    capacityPods: z.string(),
    /** GPU 용량 */
    capacityGpu: z.string(),
  }),
  /** 할당 가능 */
  allocatable: z.object({
    /** 할당 가능한 CPU */
    allocatableCpu: z.string(),
    /** 할당 가능한 임시 스토리지 */
    allocatableEphemeralStorage: z.string(),
    /** 할당 가능한 Hugepages 1Gi */
    allocatableHugepages1Gi: z.string(),
    /** 할당 가능한 Hugepages 2Mi */
    allocatableHugepages2Mi: z.string(),
    /** 할당 가능한 메모리 */
    allocatableMemory: z.string(),
    /** 할당 가능한 Pod */
    allocatablePods: z.string(),
    /** 할당 가능한 GPU */
    allocatableGpu: z.string(),
  }),
  /** 요청 */
  requests: z.object({
    /** CPU */
    cpu: z.number(),
    /** 메모리 */
    memory: z.number(),
    /** GPU */
    gpu: z.number(),
    /** CPU 사용률 (%) */
    cpuPercent: z.number(),
    /** 메모리 사용률 (%) */
    memoryPercent: z.number(),
    /** GPU 사용률 (%) */
    gpuPercent: z.number(),
  }),
  /** 제한 */
  limits: z.object({
    /** CPU */
    cpu: z.number(),
    /** 메모리 */
    memory: z.number(),
    /** GPU */
    gpu: z.number(),
    /** CPU 사용률 (%) */
    cpuPercent: z.number(),
    /** 메모리 사용률 (%) */
    memoryPercent: z.number(),
    /** GPU 사용률 (%) */
    gpuPercent: z.number(),
  }),
});

// type Node = z.infer<typeof baseNodeSchema>;
export type NodeListType = z.infer<typeof nodeListSchema>;
export type NodeDetailType = z.infer<typeof nodeDetailSchema>;
export type NodeConditionType = NodeDetailType["nodeCondition"][number];
export type NodeResourcesType = z.infer<typeof nodeResourcesSchema>;
