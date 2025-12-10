import { z } from "zod";

// ===== Response 스키마 (서버 → 프론트) =====

/** 리포트 기본 응답 스키마 */
const baseReportResponseSchema = z.object({
  /** 리포트 ID */
  id: z.string().uuid(),
  /** 리포트 이름 */
  reportName: z.string(),
  /** 리포트 타입 (주간/월간) */
  reportDateType: z.enum(["WEEKLY", "MONTHLY"]),
  /** 리포트 종류 (시스템/클러스터) */
  reportType: z.enum(["SYSTEM", "CLUSTER"]),
  /** 시작 날짜 */
  startDate: z.string().datetime(),
  /** 종료 날짜 */
  endDate: z.string().datetime(),
  /** 생성자 */
  creator: z.string(),
  /** 생성 일시 */
  createdAt: z.string().datetime(),
});

/** 리포트 목록 조회 응답 스키마 */
export const reportListResponseSchema = baseReportResponseSchema;

/**
 * 리소스 사용량 메트릭 스키마
 */
export const resourceUsageMetricSchema = z.object({
  type: z.enum(["GPU", "CPU", "MEM", "DISK"]),
  used: z.number(),
  total: z.number(),
  percentage: z.number(), // 0-100
});

/**
 * 리소스 추이 데이터 포인트 스키마
 */
export const resourceTrendDataPointSchema = z.object({
  timestamp: z.string().datetime(),
  total: z.number(), // 전체 용량
  requested: z.number(), // 할당량
  used: z.number(), // 사용량
});

/**
 * 리소스 추이 스키마
 */
export const resourceTrendSchema = z.object({
  type: z.enum(["GPU", "CPU", "MEM", "DISK"]),
  data: z.array(resourceTrendDataPointSchema),
});

/**
 * 노드 워크로드 분배 스키마
 */
export const nodeWorkloadDistributionSchema = z.object({
  nodeName: z.string(),
  totalWorkloads: z.number(),
  runningCount: z.number(),
  pendingCount: z.number(),
  failedCount: z.number(),
  completedCount: z.number(),
  gpuAllocation: z.number(),
  cpuAllocation: z.number(),
  memoryAllocation: z.number(),
  diskAllocation: z.number(),
});

/**
 * 노드 리소스 활용 스키마
 */
export const nodeResourceUtilizationSchema = z.object({
  nodeName: z.string(),
  gpuCount: z.number(),
  cpuCount: z.number(),
  memory: z.number(),
  gpuAverage: z.number(),
  gpuMax: z.number(),
  gpuMaxTimestamp: z.string().datetime(),
  cpuAverage: z.number(),
  cpuMax: z.number(),
  cpuMaxTimestamp: z.string().datetime(),
  memoryAverage: z.number(),
  memoryMax: z.number(),
  memoryMaxTimestamp: z.string().datetime(),
});

/**
 * GPU 추이 데이터 포인트 스키마
 */
export const gpuTrendDataPointSchema = z.object({
  x: z.string(), // ISO 날짜 문자열 (예: "2025-12-09T00:00:00.000Z")
  y: z.number(), // 사용률 0-100
});

/**
 * GPU 시리즈 데이터 스키마
 */
export const gpuSeriesSchema = z.object({
  name: z.string(), // "A100-0"
  data: z.array(gpuTrendDataPointSchema),
});

/**
 * 노드 GPU 정보 스키마 (리포트용)
 */
export const nodeGpuInfoSchema = z.object({
  nodeName: z.string(), // "Worker-1"
  gpuModel: z.string(), // "A100"
  gpuCount: z.number(), // 8
  percentage: z.number(), // 평균 사용률 0-100
  trendData: z.array(gpuSeriesSchema), // GPU별 사용률 추이
});

/**
 * Job Type별 분포 스키마
 */
export const jobTypeDistributionSchema = z.object({
  type: z.enum(["BATCH", "INTERACTIVE", "DISTRIBUTED"]),
  count: z.number(),
  percentage: z.number(),
});

/**
 * Job Type별 사용 시간 스키마
 */
export const jobTypeUsageTimeSchema = z.object({
  type: z.enum(["BATCH", "INTERACTIVE", "DISTRIBUTED"]),
  time: z.string(), // "123h 45m"
  percentage: z.number(),
});

/**
 * 워크로드 생성 정보 데이터 포인트 스키마
 */
export const workloadCreationDataPointSchema = z.object({
  x: z.string(), // ISO 날짜 문자열
  y: z.number(), // 퍼센트 0-100
});

/**
 * 워크로드 생성 정보 시리즈 스키마
 */
export const workloadCreationSeriesSchema = z.object({
  type: z.enum(["BATCH", "INTERACTIVE", "DISTRIBUTED"]),
  data: z.array(workloadCreationDataPointSchema),
});

/**
 * 사용자별 GPU 사용 스키마
 */
export const userGpuUsageSchema = z.object({
  userName: z.string(), // 사용자 이름
  userEmail: z.string().email(), // 사용자 이메일
  batchCount: z.number(), // Batch 생성 개수
  batchTime: z.string(), // Batch 사용 시간 (예: "123h 45m")
  interactiveCount: z.number(), // Interactive 생성 개수
  interactiveTime: z.string(), // Interactive 사용 시간
  distributedCount: z.number(), // Distributed 생성 개수
  distributedTime: z.string(), // Distributed 사용 시간
  gpuAllocation: z.number(), // GPU 할당량
  gpuUsagePercentage: z.number(), // GPU 사용률 (0-100)
});

/**
 * 노드 시스템 정보 스키마
 */
export const nodeSystemInfoSchema = z.object({
  nodeName: z.string(), // 노드명
  ipAddress: z.string().ip(), // IP 주소
  osInfo: z.string(), // OS 정보 (예: "Ubuntu 20.04")
  gpuInfo: z.string(), // GPU 정보 (예: "NVIDIA A100")
  gpuCount: z.number(), // GPU 개수
  cpuInfo: z.string(), // CPU 정보 (예: "Intel Xeon Gold 6248R")
  cpu: z.number(), // CPU 코어 수
  memory: z.number(), // Memory (GB)
  disk: z.number(), // Disk (GB)
});

/**
 * GPU 온도 경고 스키마
 */
export const gpuTemperatureWarningSchema = z.object({
  nodeName: z.string(), // 노드명
  gpuIndex: z.number(), // GPU Index
  date: z.string().datetime(), // 날짜
  avgTemperature: z.number(), // GPU 평균 온도
  maxTemperature: z.number(), // GPU 최대 온도
});

/**
 * CPU 사용률 경고 스키마 (90% 이상)
 */
export const cpuUsageWarningSchema = z.object({
  nodeName: z.string(), // 노드명
  gpuIndex: z.number(), // GPU Index
  date: z.string().datetime(), // 날짜
  avgUsage: z.number(), // CPU(%) 평균
  maxUsage: z.number(), // CPU(%) 최대
});

/**
 * Memory 사용률 경고 스키마 (90% 이상)
 */
export const memoryUsageWarningSchema = z.object({
  nodeName: z.string(), // 노드명
  gpuIndex: z.number(), // GPU Index
  date: z.string().datetime(), // 날짜
  avgUsage: z.number(), // Memory(%) 평균
  maxUsage: z.number(), // Memory(%) 최대
});

/**
 * Disk 사용률 경고 스키마 (90% 이상)
 */
export const diskUsageWarningSchema = z.object({
  nodeName: z.string(), // 노드명
  gpuIndex: z.number(), // GPU Index
  date: z.string().datetime(), // 날짜
  avgUsage: z.number(), // Disk(%) 평균
  maxUsage: z.number(), // Disk(%) 최대
});

/**
 * 리포트 상세 응답 스키마
 */
export const reportDetailResponseSchema = z.object({
  id: z.string().uuid(),
  reportName: z.string(),
  reportDateType: z.enum(["WEEKLY", "MONTHLY"]),
  reportType: z.enum(["SYSTEM", "CLUSTER"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  creator: z.string(),
  createdAt: z.string().datetime(),
  resourceUsage: z.object({
    periodLabel: z.string(), // "2025년 7월" or "2025년 7월 1주차"
    title: z.string(),
    metrics: z.array(resourceUsageMetricSchema),
  }),
  resourceTrends: z.array(resourceTrendSchema),
  nodeDistribution: z.array(nodeWorkloadDistributionSchema),
  nodeResourceUtilization: z.array(nodeResourceUtilizationSchema),
  nodes: z.array(nodeGpuInfoSchema),
  jobTypeDistribution: z.array(jobTypeDistributionSchema),
  jobTypeUsageTime: z.array(jobTypeUsageTimeSchema),
  workloadCreation: z.array(workloadCreationSeriesSchema),
  userGpuUsage: z.array(userGpuUsageSchema).default([]),
  nodeSystemInfo: z.array(nodeSystemInfoSchema).default([]),
  gpuTemperatureWarning: z.array(gpuTemperatureWarningSchema).default([]),
  cpuUsageWarning: z.array(cpuUsageWarningSchema).default([]),
  memoryUsageWarning: z.array(memoryUsageWarningSchema).default([]),
  diskUsageWarning: z.array(diskUsageWarningSchema).default([]),
});

// ===== 타입 추출 =====

// Response 타입
export type ReportListType = z.infer<typeof reportListResponseSchema>;
export type ResourceUsageMetric = z.infer<typeof resourceUsageMetricSchema>;
export type ResourceTrendDataPoint = z.infer<
  typeof resourceTrendDataPointSchema
>;
export type ResourceTrend = z.infer<typeof resourceTrendSchema>;
export type NodeWorkloadDistribution = z.infer<
  typeof nodeWorkloadDistributionSchema
>;
export type NodeResourceUtilization = z.infer<
  typeof nodeResourceUtilizationSchema
>;
export type GpuTrendDataPoint = z.infer<typeof gpuTrendDataPointSchema>;
export type GpuSeries = z.infer<typeof gpuSeriesSchema>;
export type NodeGpuInfo = z.infer<typeof nodeGpuInfoSchema>;
export type JobTypeDistribution = z.infer<typeof jobTypeDistributionSchema>;
export type JobTypeUsageTime = z.infer<typeof jobTypeUsageTimeSchema>;
export type WorkloadCreationDataPoint = z.infer<
  typeof workloadCreationDataPointSchema
>;
export type WorkloadCreationSeries = z.infer<
  typeof workloadCreationSeriesSchema
>;
export type UserGpuUsage = z.infer<typeof userGpuUsageSchema>;
export type NodeSystemInfo = z.infer<typeof nodeSystemInfoSchema>;
export type GpuTemperatureWarning = z.infer<typeof gpuTemperatureWarningSchema>;
export type CpuUsageWarning = z.infer<typeof cpuUsageWarningSchema>;
export type MemoryUsageWarning = z.infer<typeof memoryUsageWarningSchema>;
export type DiskUsageWarning = z.infer<typeof diskUsageWarningSchema>;
export type ReportDetailResponse = z.infer<typeof reportDetailResponseSchema>;
