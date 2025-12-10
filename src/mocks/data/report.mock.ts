import {
  REPORT_DATE_TYPE,
  REPORT_TYPE,
} from "@/domain/report/constants/report.constant";
import type {
  CpuUsageWarning,
  DiskUsageWarning,
  GpuSeries,
  GpuTemperatureWarning,
  JobTypeDistribution,
  JobTypeUsageTime,
  MemoryUsageWarning,
  NodeGpuInfo,
  NodeSystemInfo,
  ReportDetailResponse,
  ResourceTrend,
  ResourceUsageMetric,
  UserGpuUsage,
  WorkloadCreationSeries,
} from "@/domain/report/schemas/report.schema";
import {
  nodeResourceUtilizationSchema,
  nodeWorkloadDistributionSchema,
  reportListResponseSchema,
} from "@/domain/report/schemas/report.schema";
import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
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
  const reportType: "SYSTEM" | "CLUSTER" =
    i % 2 === 0 ? REPORT_TYPE.SYSTEM : REPORT_TYPE.CLUSTER;
  const reportDateType: "WEEKLY" | "MONTHLY" =
    Math.floor(i / 2) % 2 === 0
      ? REPORT_DATE_TYPE.WEEKLY
      : REPORT_DATE_TYPE.MONTHLY;
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
  const jobTypes: WorkloadJobType[] = ["BATCH", "INTERACTIVE", "DISTRIBUTED"];

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
  const jobTypes: WorkloadJobType[] = ["BATCH", "INTERACTIVE", "DISTRIBUTED"];

  // 랜덤 시간 생성 (시간 단위, float로 생성하여 분 포함)
  const hours = jobTypes.map(() => Math.random() * 500 + 50);
  const totalHours = hours.reduce((sum, hour) => sum + hour, 0);

  return jobTypes.map((type, index) => {
    const h = Math.floor(hours[index]);
    const m = Math.floor((hours[index] % 1) * 60);
    return {
      type,
      time: `${h}시간 ${m}분`,
      percentage: Math.floor((hours[index] / totalHours) * 100),
    };
  });
};

/**
 * 워크로드 생성 정보 데이터 생성
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 */
const createWorkloadCreation = (
  startDate: string,
  endDate: string,
): WorkloadCreationSeries[] => {
  const jobTypes: WorkloadJobType[] = ["BATCH", "INTERACTIVE", "DISTRIBUTED"];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return jobTypes.map((type) => ({
    type,
    data: Array.from({ length: dayCount + 1 }, (_, dayIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + dayIndex);
      return {
        x: date.toISOString(), // ISO 날짜 문자열
        y: Math.floor(Math.random() * 60) + 20, // 20-80% 랜덤
      };
    }),
  }));
};

/**
 * 사용자별 GPU 사용 데이터 생성
 */
const createUserGpuUsage = (): UserGpuUsage[] => {
  const users = [
    { userName: "김철수", userEmail: "kim.cs@example.com" },
    { userName: "이영희", userEmail: "lee.yh@example.com" },
    { userName: "박민수", userEmail: "park.ms@example.com" },
    { userName: "최지은", userEmail: "choi.je@example.com" },
    { userName: "정다은", userEmail: "jung.de@example.com" },
  ];

  return users.map((user) => {
    const batchCount = Math.floor(Math.random() * 50) + 10;
    const interactiveCount = Math.floor(Math.random() * 30) + 5;
    const distributedCount = Math.floor(Math.random() * 20) + 5;

    const batchHours = Math.floor(Math.random() * 200) + 50;
    const interactiveHours = Math.floor(Math.random() * 100) + 20;
    const distributedHours = Math.floor(Math.random() * 150) + 30;

    return {
      userName: user.userName,
      userEmail: user.userEmail,
      batchCount,
      batchTime: `${batchHours}시간 ${Math.floor(Math.random() * 60)}분`,
      interactiveCount,
      interactiveTime: `${interactiveHours}시간 ${Math.floor(Math.random() * 60)}분`,
      distributedCount,
      distributedTime: `${distributedHours}시간 ${Math.floor(Math.random() * 60)}분`,
      gpuAllocation: Math.floor(Math.random() * 16) + 2, // 2-18 GPU
      gpuUsagePercentage: Math.floor(Math.random() * 60) + 30, // 30-90%
    };
  });
};

/**
 * 노드 시스템 정보 데이터 생성
 */
const createNodeSystemInfo = (): NodeSystemInfo[] => {
  const nodes = [
    {
      nodeName: "Worker-1",
      ipAddress: "192.168.1.101",
      osInfo: "Ubuntu 20.04.6 LTS",
      gpuInfo: "NVIDIA A100",
      gpuCount: 8,
      cpuInfo: "Intel Xeon Gold 6248R",
      cpu: 96,
      memory: 512,
      disk: 2048,
    },
    {
      nodeName: "Worker-2",
      ipAddress: "192.168.1.102",
      osInfo: "Ubuntu 20.04.6 LTS",
      gpuInfo: "NVIDIA A100",
      gpuCount: 8,
      cpuInfo: "Intel Xeon Gold 6248R",
      cpu: 96,
      memory: 512,
      disk: 2048,
    },
    {
      nodeName: "Worker-3",
      ipAddress: "192.168.1.103",
      osInfo: "Ubuntu 22.04.3 LTS",
      gpuInfo: "NVIDIA V100",
      gpuCount: 4,
      cpuInfo: "Intel Xeon Gold 6230",
      cpu: 80,
      memory: 384,
      disk: 1536,
    },
    {
      nodeName: "Worker-4",
      ipAddress: "192.168.1.104",
      osInfo: "Ubuntu 22.04.3 LTS",
      gpuInfo: "NVIDIA A100",
      gpuCount: 8,
      cpuInfo: "AMD EPYC 7742",
      cpu: 128,
      memory: 1024,
      disk: 4096,
    },
    {
      nodeName: "Worker-5",
      ipAddress: "192.168.1.105",
      osInfo: "Ubuntu 20.04.6 LTS",
      gpuInfo: "NVIDIA V100",
      gpuCount: 4,
      cpuInfo: "Intel Xeon Gold 6230",
      cpu: 80,
      memory: 384,
      disk: 1536,
    },
  ];

  return nodes;
};

/**
 * GPU 온도 경고 데이터 생성 (90도 이상)
 */
const createGpuTemperatureWarning = (): GpuTemperatureWarning[] => {
  const warnings: GpuTemperatureWarning[] = [];
  const nodes = ["Worker-1", "Worker-2", "Worker-3", "Worker-4", "Worker-5"];
  const gpuCounts = [8, 8, 4, 8, 4];

  // 랜덤하게 일부 GPU에만 경고 생성 (90도 이상)
  nodes.forEach((nodeName, nodeIndex) => {
    const warningCount = Math.floor(Math.random() * 3); // 0-2개의 경고
    for (let i = 0; i < warningCount; i++) {
      const gpuIndex = Math.floor(Math.random() * gpuCounts[nodeIndex]);
      const daysAgo = Math.floor(Math.random() * 7); // 최근 7일 이내
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      warnings.push({
        nodeName,
        gpuIndex,
        date: date.toISOString(),
        avgTemperature: Math.floor(Math.random() * 5) + 90, // 90-94도
        maxTemperature: Math.floor(Math.random() * 8) + 95, // 95-102도
      });
    }
  });

  // 날짜 기준 내림차순 정렬 (최신순)
  return warnings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

/**
 * CPU 사용률 경고 데이터 생성 (90% 이상)
 */
const createCpuUsageWarning = (): CpuUsageWarning[] => {
  const warnings: CpuUsageWarning[] = [];
  const nodes = ["Worker-1", "Worker-2", "Worker-3", "Worker-4", "Worker-5"];
  const gpuCounts = [8, 8, 4, 8, 4];

  // 랜덤하게 일부 GPU에만 경고 생성 (90% 이상)
  nodes.forEach((nodeName, nodeIndex) => {
    const warningCount = Math.floor(Math.random() * 3); // 0-2개의 경고
    for (let i = 0; i < warningCount; i++) {
      const gpuIndex = Math.floor(Math.random() * gpuCounts[nodeIndex]);
      const daysAgo = Math.floor(Math.random() * 7); // 최근 7일 이내
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      warnings.push({
        nodeName,
        gpuIndex,
        date: date.toISOString(),
        avgUsage: Math.floor(Math.random() * 5) + 90, // 90-94%
        maxUsage: Math.floor(Math.random() * 8) + 95, // 95-102%
      });
    }
  });

  // 날짜 기준 내림차순 정렬 (최신순)
  return warnings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

/**
 * Memory 사용률 경고 데이터 생성 (90% 이상)
 */
const createMemoryUsageWarning = (): MemoryUsageWarning[] => {
  const warnings: MemoryUsageWarning[] = [];
  const nodes = ["Worker-1", "Worker-2", "Worker-3", "Worker-4", "Worker-5"];
  const gpuCounts = [8, 8, 4, 8, 4];

  // 랜덤하게 일부 GPU에만 경고 생성 (90% 이상)
  nodes.forEach((nodeName, nodeIndex) => {
    const warningCount = Math.floor(Math.random() * 3); // 0-2개의 경고
    for (let i = 0; i < warningCount; i++) {
      const gpuIndex = Math.floor(Math.random() * gpuCounts[nodeIndex]);
      const daysAgo = Math.floor(Math.random() * 7); // 최근 7일 이내
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      warnings.push({
        nodeName,
        gpuIndex,
        date: date.toISOString(),
        avgUsage: Math.floor(Math.random() * 5) + 90, // 90-94%
        maxUsage: Math.floor(Math.random() * 8) + 95, // 95-102%
      });
    }
  });

  // 날짜 기준 내림차순 정렬 (최신순)
  return warnings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

/**
 * Disk 사용률 경고 데이터 생성 (90% 이상)
 */
const createDiskUsageWarning = (): DiskUsageWarning[] => {
  const warnings: DiskUsageWarning[] = [];
  const nodes = ["Worker-1", "Worker-2", "Worker-3", "Worker-4", "Worker-5"];
  const gpuCounts = [8, 8, 4, 8, 4];

  // 랜덤하게 일부 GPU에만 경고 생성 (90% 이상)
  nodes.forEach((nodeName, nodeIndex) => {
    const warningCount = Math.floor(Math.random() * 3); // 0-2개의 경고
    for (let i = 0; i < warningCount; i++) {
      const gpuIndex = Math.floor(Math.random() * gpuCounts[nodeIndex]);
      const daysAgo = Math.floor(Math.random() * 7); // 최근 7일 이내
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      warnings.push({
        nodeName,
        gpuIndex,
        date: date.toISOString(),
        avgUsage: Math.floor(Math.random() * 5) + 90, // 90-94%
        maxUsage: Math.floor(Math.random() * 8) + 95, // 95-102%
      });
    }
  });

  // 날짜 기준 내림차순 정렬 (최신순)
  return warnings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
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
    reportName: `${reportType === REPORT_TYPE.SYSTEM ? "시스템" : "클러스터"} ${reportDateType === REPORT_DATE_TYPE.WEEKLY ? "주간" : "월간"} 리포트`,
    reportDateType,
    reportType,
    startDate,
    endDate,
    creator: "관리자",
    createdAt: new Date().toISOString(),
    resourceUsage: {
      periodLabel: "2025년 1월",
      title:
        reportType === REPORT_TYPE.SYSTEM
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
    workloadCreation: createWorkloadCreation(startDate, endDate),
    userGpuUsage: createUserGpuUsage(),
    // SYSTEM 리포트에만 포함되는 데이터
    nodeSystemInfo: reportType === "SYSTEM" ? createNodeSystemInfo() : [],
    gpuTemperatureWarning:
      reportType === "SYSTEM" ? createGpuTemperatureWarning() : [],
    cpuUsageWarning: reportType === "SYSTEM" ? createCpuUsageWarning() : [],
    memoryUsageWarning:
      reportType === "SYSTEM" ? createMemoryUsageWarning() : [],
    diskUsageWarning: reportType === "SYSTEM" ? createDiskUsageWarning() : [],
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
    mockReportDetailMap.get(id) ||
    createReportDetail(id, REPORT_TYPE.CLUSTER, REPORT_DATE_TYPE.MONTHLY) // fallback
  );
};
