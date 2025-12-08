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
export type ReportDetailResponse = z.infer<typeof reportDetailResponseSchema>;
