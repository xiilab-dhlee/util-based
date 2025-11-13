import { HttpResponse, http } from "msw";

import filetreeConstants from "@/constants/common/filetree.constant";
import {
  vulnerabilityListMock,
  workloadDetailMock,
  workloadListMock,
} from "@/mocks/workload.mock";
import { generateCustomTree } from "@/utils/common/filetree-generator.util";

/**
 * 워크로드 API 핸들러
 */
export const workloadHandlers = [
  // 워크로드 목록 조회
  http.get("/core-api/v1/core/workload", () => {
    return HttpResponse.json({
      content: workloadListMock,
      totalSize: 100,
    });
  }),

  // 워크로드 보안 취약점 목록 조회 (동적 파라미터 경로보다 먼저 배치)
  http.get("/core-api/v1/core/workload/vulnerabilities", () => {
    return HttpResponse.json({
      content: vulnerabilityListMock,
      totalSize: 100,
    });
  }),

  // 워크로드 파일 조회 (동적 파라미터 경로보다 먼저 배치)
  http.get("/core-api/v1/core/workload/:id/files/list", () => {
    return HttpResponse.json({
      content: generateCustomTree(filetreeConstants.mlProjectTemplate),
      directoryCnt: 10,
      totalSize: 100,
    });
  }),

  // 워크로드 상세 조회 (가장 구체적이지 않은 경로는 마지막에 배치)
  http.get("/core-api/v1/core/workload/:id", () => {
    return HttpResponse.json(workloadDetailMock);
  }),

  // 관리자 워크로드 목록 조회
  http.get("/core-api/v1/core/admin/workload", () => {
    return HttpResponse.json({
      content: workloadListMock,
      totalSize: 100,
    });
  }),

  // 관리자 워크로드 상세 조회
  http.get("/core-api/v1/core/admin/workload/:id", () => {
    return HttpResponse.json(workloadDetailMock);
  }),
];
