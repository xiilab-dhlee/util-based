import { z } from "zod";

/**
 * 리소스 사용량 메트릭 스키마
 */
export const resourceUsageMetricSchema = z.object({
  type: z.enum(["GPU", "CPU", "MEM", "DISK"]),
  used: z.number(),
  total: z.number(),
  percentage: z.number(), // 0-100
  unit: z.string(), // "개", "Core", "GB", "TB"
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
});

export type ResourceUsageMetric = z.infer<typeof resourceUsageMetricSchema>;
export type ResourceTrendDataPoint = z.infer<
  typeof resourceTrendDataPointSchema
>;
export type ResourceTrend = z.infer<typeof resourceTrendSchema>;
export type ReportDetailResponse = z.infer<typeof reportDetailResponseSchema>;
