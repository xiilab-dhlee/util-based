import type {
  GpuSeries,
  JobTypeDistribution,
  JobTypeUsageTime,
  NodeGpuInfo,
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
import type { WorkloadJobType } from "@/shared/constants/workload.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 고정된 UUID 목록 (테스트 시 일관성 유지)
 */
const FIXED_REPORT_IDS = [
  "550e8400-e29b-41d4-a716-446655440000",
  "550e8400-e29b-41d4-a716-446655440001",
  "550e8400-e29b-41d4-a716-446655440002",
  "550e8400-e29b-41d4-a716-446655440003",
  "550e8400-e29b-41d4-a716-446655440004",
  "550e8400-e29b-41d4-a716-446655440005",
  "550e8400-e29b-41d4-a716-446655440006",
  "550e8400-e29b-41d4-a716-446655440007",
  "550e8400-e29b-41d4-a716-446655440008",
  "550e8400-e29b-41d4-a716-446655440009",
];

/**
 * 리포트 목록 Mock 데이터
 * - 일관성을 위해 고정된 UUID와 reportType 사용
 */
export const reportListMock = Array.from({ length: LIST_PAGE_SIZE }, (_, i) => {
  const reportType: "SYSTEM" | "CLUSTER" = i % 2 === 0 ? "SYSTEM" : "CLUSTER";
  const reportDateType: "WEEKLY" | "MONTHLY" =
    i % 3 === 0 ? "WEEKLY" : "MONTHLY";
  const baseReport = makeMock(reportListResponseSchema);

  return {
    ...baseReport,
    id:
      FIXED_REPORT_IDS[i] ||
      `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, "0")}`,
    reportType,
    reportDateType,
  };
});

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
 * 고정된 노드 GPU 정보
 */
const MOCK_NODE_GPU_INFO = [
  { nodeName: "Worker-1", gpuModel: "A100", gpuCount: 8 },
  { nodeName: "Worker-2", gpuModel: "A100", gpuCount: 8 },
  { nodeName: "Worker-3", gpuModel: "V100", gpuCount: 4 },
];

/**
 * GPU별 추이 데이터 생성
 * @param gpuCount GPU 개수
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 */
const createGpuTrendData = (
  gpuCount: number,
  startDate: string,
  endDate: string,
): GpuSeries[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Array.from({ length: gpuCount }, (_, gpuIndex) => ({
    name: `GPU-${gpuIndex}`,
    data: Array.from({ length: dayCount + 1 }, (_, dayIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + dayIndex);
      return {
        x: date.toISOString(), // ISO 날짜 문자열로 반환
        y: Math.floor(Math.random() * 70) + 20, // 20-90% 랜덤
      };
    }),
  }));
};

/**
 * 노드 GPU 정보 생성
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 */
const createNodeGpuInfo = (
  startDate: string,
  endDate: string,
): NodeGpuInfo[] => {
  return MOCK_NODE_GPU_INFO.map((node) => ({
    ...node,
    percentage: Math.floor(Math.random() * 70) + 20, // 20-90% 랜덤
    trendData: createGpuTrendData(node.gpuCount, startDate, endDate),
  }));
};

/**
 * Job Type별 분포 데이터 생성
 */
const createJobTypeDistribution = (): JobTypeDistribution[] => {
  const jobTypes: WorkloadJobType[] = [
    "TRAIN",
    "INFERENCE",
    "DEPLOYMENT",
    "NOTEBOOK",
  ];

  // 랜덤 count 생성
  const counts = jobTypes.map(() => Math.floor(Math.random() * 50) + 10);
  const total = counts.reduce((sum, count) => sum + count, 0);

  return jobTypes.map((type, index) => ({
    type,
    count: counts[index],
    percentage: Math.floor((counts[index] / total) * 100),
  }));
};

/**
 * Job Type별 사용 시간 데이터 생성
 */
const createJobTypeUsageTime = (): JobTypeUsageTime[] => {
  const jobTypes: WorkloadJobType[] = [
    "TRAIN",
    "INFERENCE",
    "DEPLOYMENT",
    "NOTEBOOK",
  ];

  // 랜덤 시간 생성 (시간 단위)
  const hours = jobTypes.map(() => Math.floor(Math.random() * 500) + 50);
  const totalHours = hours.reduce((sum, hour) => sum + hour, 0);

  return jobTypes.map((type, index) => {
    const h = Math.floor(hours[index]);
    const m = Math.floor((hours[index] - h) * 60);
    return {
      type,
      time: `${h}h ${m}m`,
      percentage: Math.floor((hours[index] / totalHours) * 100),
    };
  });
};

/**
 * ID로 리포트 상세 데이터를 생성
 */
const createReportDetail = (
  id: string,
  reportType: "SYSTEM" | "CLUSTER",
  reportDateType: "WEEKLY" | "MONTHLY",
): ReportDetailResponse => {
  const startDate = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const endDate = new Date().toISOString();

  return {
    id,
    reportName: `${reportType === "SYSTEM" ? "시스템" : "클러스터"} ${reportDateType === "WEEKLY" ? "주간" : "월간"} 리포트`,
    reportDateType,
    reportType,
    startDate,
    endDate,
    creator: "관리자",
    createdAt: new Date().toISOString(),
    resourceUsage: {
      periodLabel: "2025년 1월",
      title:
        reportType === "SYSTEM"
          ? "시스템 리소스 사용현황"
          : "클러스터 평균 리소스 활용률",
      metrics: createResourceMetrics(),
    },
    resourceTrends: createResourceTrends(),
    nodeDistribution: Array.from({ length: 10 }, () =>
      makeMock(nodeWorkloadDistributionSchema),
    ),
    nodeResourceUtilization: Array.from({ length: 10 }, () =>
      makeMock(nodeResourceUtilizationSchema),
    ),
    nodes: createNodeGpuInfo(startDate, endDate),
    jobTypeDistribution: createJobTypeDistribution(),
    jobTypeUsageTime: createJobTypeUsageTime(),
  };
};

/**
 * 리포트 상세 Mock 데이터 맵
 * - 목록의 ID와 일치하도록 생성
 */
export const mockReportDetailMap = new Map<string, ReportDetailResponse>(
  reportListMock.map(
    (report) =>
      [
        report.id,
        createReportDetail(report.id, report.reportType, report.reportDateType),
      ] as const,
  ),
);

/**
 * ID로 리포트 상세 조회
 */
export const getMockReportDetail = (id: string): ReportDetailResponse => {
  return (
    mockReportDetailMap.get(id) || createReportDetail(id, "CLUSTER", "MONTHLY") // fallback
  );
};
