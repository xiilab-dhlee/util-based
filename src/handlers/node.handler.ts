import { HttpResponse, http } from "msw";

import nodeMigConstants from "@/constants/node/node-mig.constant";
import { mpsInfoMock } from "@/mocks/mps.mock";
import { nodeListMock } from "@/mocks/node.mock";

/**
 * 노드 API 핸들러
 */
export const nodeHandlers = [
  // 노드 목록 조회
  http.get("/core-api/v1/core/nodes", () => {
    return HttpResponse.json({
      content: nodeListMock,
      totalSize: 100,
    });
  }),

  // 노드 상세 조회
  http.get("/core-api/v1/core/nodes/:nodeName", () => {
    return HttpResponse.json(nodeListMock[0]);
  }),

  // MPS 설정 조회
  http.get("/core-api/v1/core/nodes/:nodeName/mps", () => {
    return HttpResponse.json(mpsInfoMock);
  }),

  // MIG 설정 조회
  http.get("/core-api/v1/core/nodes/:nodeName/mig", () => {
    return HttpResponse.json(nodeMigConstants.migInfoDemo);
  }),
];
