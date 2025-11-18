import { HttpResponse, http } from "msw";

import { ML_PROJECT_TEMPLATE } from "@/constants/common/filetree.constant";
import {
  workloadDetailMock,
  workloadListMock,
  workloadVulnerabilityListMock,
} from "@/mocks/workload.mock";
import { generateCustomTree } from "@/utils/common/filetree-generator.util";

/**
 * 워크로드 API 핸들러
 */
export const workloadHandlers = [
  // 워크로드 목록 조회
  http.get("/core-api/v1/core/workload", ({ request }) => {
    const url = new URL(request.url);
    const searchText = url.searchParams.get("searchText");

    // 검색어가 있는 경우 필터링
    let filteredContent = workloadListMock;
    if (searchText) {
      filteredContent = workloadListMock.filter((workload) =>
        workload.workloadName?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return HttpResponse.json({
      content: filteredContent,
      totalSize: filteredContent.length,
    });
  }),

  // 워크로드 보안 취약점 목록 조회 (동적 파라미터 경로보다 먼저 배치)
  http.get("/core-api/v1/core/workload/vulnerabilities", () => {
    return HttpResponse.json({
      content: workloadVulnerabilityListMock,
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
    const searchText = url.searchParams.get("searchText");

    // 검색어가 있는 경우 필터링
    let filteredContent = workloadListMock;
    if (searchText) {
      filteredContent = workloadListMock.filter((workload) =>
        workload.workloadName?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return HttpResponse.json({
      content: filteredContent,
      totalSize: filteredContent.length,
    });
  }),

  // 관리자 워크로드 상세 조회
  http.get("/core-api/v1/core/admin/workload/:id", () => {
    return HttpResponse.json(workloadDetailMock);
  }),
];
