import { HttpResponse, http } from "msw";

import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import {
  createWorkloadListMock,
  workloadDetailMock,
} from "@/mocks/data/workload.mock";
import { WORKLOAD_ENDPOINTS } from "@/shared/constants/endpoint.constant";
import { ML_PROJECT_TEMPLATE } from "@/shared/constants/filetree.constant";
import { generateCustomTree } from "@/shared/utils/filetree-generator.util";
import { paramsToOverride } from "@/shared/utils/service.util";

/**
 * 워크로드 API 핸들러
 */
export const workloadHandlers = [
  // 활성화 워크로드 목록 (COMPLETED 제외)
  http.get(WORKLOAD_ENDPOINTS.active, ({ request }) => {
    const url = new URL(request.url);

    const override = paramsToOverride<WorkloadListType>(url.searchParams);
    const content = createWorkloadListMock({
      ...override,
      excludeStatuses: ["COMPLETED"],
    });

    return HttpResponse.json({
      content,
      totalSize: 100,
    });
  }),
  // 워크로드 목록 조회
  http.get(WORKLOAD_ENDPOINTS.base, ({ request }) => {
    const url = new URL(request.url);

    const override = paramsToOverride<WorkloadListType>(url.searchParams);
    const content = createWorkloadListMock(override);

    return HttpResponse.json({
      content,
      totalSize: 100,
    });
  }),

  // 워크로드 파일 조회 (동적 파라미터 경로보다 먼저 배치)
  http.get("/core-api/v1/core/workload/:id/files/list", () => {
    return HttpResponse.json({
      content: generateCustomTree(ML_PROJECT_TEMPLATE),
      directoryCnt: 10,
      totalSize: 100,
    });
  }),

  // 워크로드 상세 조회 (가장 구체적이지 않은 경로는 마지막에 배치)
  http.get("/core-api/v1/core/workload/:id", () => {
    return HttpResponse.json(workloadDetailMock);
  }),

  // 관리자 워크로드 목록 조회
  http.get("/core-api/v1/core/admin/workload", ({ request }) => {
    const url = new URL(request.url);

    const override = paramsToOverride<WorkloadListType>(url.searchParams);
    const content = createWorkloadListMock(override);

    return HttpResponse.json({
      content,
      totalSize: 100,
    });
  }),

  // 관리자 워크로드 상세 조회
  http.get("/core-api/v1/core/admin/workload/:id", () => {
    return HttpResponse.json(workloadDetailMock);
  }),
];
