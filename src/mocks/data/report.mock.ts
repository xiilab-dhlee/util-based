import { reportListResponseSchema } from "@/domain/report/schemas/report.schema";
import type { ReportDetailResponse } from "@/domain/report/schemas/report-detail.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 리포트 목록 Mock 데이터
 */
export const reportListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(reportListResponseSchema),
);

/**
 * 리포트 상세 Mock 데이터
 */
export const mockReportDetail: ReportDetailResponse = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  reportName: "7월 월간 클러스터 리포트",
  reportDateType: "MONTHLY",
  reportType: "CLUSTER",
  startDate: "2025-07-01T00:00:00Z",
  endDate: "2025-07-31T23:59:59Z",
  creator: "관리자",
  createdAt: "2025-07-31T10:00:00Z",
  resourceUsage: {
    periodLabel: "2025년 7월",
    title: "클러스터 리소스 활용 정보",
    metrics: [
      { type: "GPU", used: 9, total: 12, percentage: 75, unit: "개" },
      { type: "CPU", used: 180, total: 300, percentage: 60, unit: "Core" },
      { type: "MEM", used: 17.85, total: 21, percentage: 85, unit: "GB" },
      { type: "DISK", used: 9.45, total: 21, percentage: 45, unit: "TB" },
    ],
  },
};
