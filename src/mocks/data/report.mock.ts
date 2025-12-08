import type {
  ReportDetailResponse,
  ResourceTrend,
  ResourceUsageMetric,
} from "@/domain/report/schemas/report.schema";
import {
  nodeResourceUtilizationSchema,
  nodeWorkloadDistributionSchema,
  reportListResponseSchema,
} from "@/domain/report/schemas/report.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 리포트 목록 Mock 데이터
 */
export const reportListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(reportListResponseSchema),
);

/**
 * 리소스 타입별로 고유한 메트릭 생성
 */
const createResourceMetrics = (): ResourceUsageMetric[] => {
  const types: Array<"GPU" | "CPU" | "MEM" | "DISK"> = [
    "GPU",
    "CPU",
    "MEM",
    "DISK",
  ];
  return types.map((type) => {
    const total = Math.floor(Math.random() * 1000) + 100;
    const used = Math.floor(Math.random() * total);
    const percentage = Math.floor((used / total) * 100);
    return { type, used, total, percentage };
  });
};

/**
 * 리소스 타입별로 고유한 추이 데이터 생성
 */
const createResourceTrends = (): ResourceTrend[] => {
  const types: Array<"GPU" | "CPU" | "MEM" | "DISK"> = [
    "GPU",
    "CPU",
    "MEM",
    "DISK",
  ];
  return types.map((type) => {
    // 7일치 데이터 생성 (오늘부터 6일 전까지)
    const data = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index)); // 6일 전부터 오늘까지
      const total = Math.floor(Math.random() * 1000) + 100;
      const requested = Math.floor(Math.random() * total);
      const used = Math.floor(Math.random() * requested);
      return {
        timestamp: date.toISOString(),
        total,
        requested,
        used,
      };
    });
    return { type, data };
  });
};

/**
 * 리포트 상세 Mock 데이터
 */
export const mockReportDetail: ReportDetailResponse = {
  id: crypto.randomUUID(),
  reportName: `테스트 리포트 ${Math.floor(Math.random() * 100)}`,
  reportDateType: Math.random() > 0.5 ? "WEEKLY" : "MONTHLY",
  reportType: Math.random() > 0.5 ? "SYSTEM" : "CLUSTER",
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date().toISOString(),
  creator: "관리자",
  createdAt: new Date().toISOString(),
  resourceUsage: {
    periodLabel: "2025년 1월",
    title: "클러스터 평균 리소스 활용률",
    metrics: createResourceMetrics(),
  },
  resourceTrends: createResourceTrends(),
  nodeDistribution: Array.from({ length: 10 }, () =>
    makeMock(nodeWorkloadDistributionSchema),
  ),
  nodeResourceUtilization: Array.from({ length: 10 }, () =>
    makeMock(nodeResourceUtilizationSchema),
  ),
};
