import { HttpResponse, http } from "msw";

import { getMockReportDetail, reportListMock } from "@/mocks/data/report.mock";

/**
 * 리포트 API 핸들러
 */
export const reportHandlers = [
  // 리포트 목록 조회
  http.get("/core-api/v1/core/report", () => {
    return HttpResponse.json({
      content: reportListMock,
      totalSize: 100,
    });
  }),

  // 리포트 상세 조회
  http.get("/core-api/v1/core/report/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json(getMockReportDetail(id as string));
  }),
];
