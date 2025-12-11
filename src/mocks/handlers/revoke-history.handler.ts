import { HttpResponse, http } from "msw";

import type { REVOKE_HISTORY_DETAIL_TYPE } from "@/domain/revoke/constants/revoke-history.constant";
import {
  REVOKE_CRITERIA_MOCK,
  REVOKE_HISTORY_DETAIL_ITEM_MOCK_DATA,
  REVOKE_HISTORY_DETAIL_ITEM_MOCK_TOTAL,
  REVOKE_HISTORY_DETAIL_MOCK_DATA,
  REVOKE_HISTORY_MOCK_DATA,
  REVOKE_HISTORY_MOCK_TOTAL,
} from "@/domain/revoke/mock/revoke-history.mock";

/**
 * 리소스 회수 이력 API 핸들러
 */
export const revokeHistoryHandlers = [
  // 리소스 회수 이력 목록 조회
  http.get("/core-api/v1/core/admin/revoke-history", ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "20");

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const paginatedData = REVOKE_HISTORY_MOCK_DATA.slice(startIndex, endIndex);

    return HttpResponse.json({
      content: paginatedData,
      totalSize: REVOKE_HISTORY_MOCK_TOTAL,
      page,
      size,
    });
  }),

  // 리소스 회수 이력 상세 조회 (경고/회수 목록)
  http.get(
    "/core-api/v1/core/admin/revoke-history/:id",
    ({ request, params }) => {
      const url = new URL(request.url);
      const { id } = params;

      const page = Number(url.searchParams.get("page") ?? "1");
      const size = Number(url.searchParams.get("size") ?? "20");
      const type = url.searchParams.get("type") as
        | (typeof REVOKE_HISTORY_DETAIL_TYPE)[keyof typeof REVOKE_HISTORY_DETAIL_TYPE]
        | null;

      // type 필터링
      let filteredData = REVOKE_HISTORY_DETAIL_ITEM_MOCK_DATA;
      if (type) {
        filteredData = filteredData.filter((item) => item.type === type);
      }

      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return HttpResponse.json({
        // 상세 정보 (사이드바용)
        detail: {
          ...REVOKE_HISTORY_DETAIL_MOCK_DATA,
          id: String(id),
        },
        // 경고/회수 목록
        content: paginatedData,
        totalSize: type
          ? filteredData.length
          : REVOKE_HISTORY_DETAIL_ITEM_MOCK_TOTAL,
        page,
        size,
      });
    },
  ),

  // 리소스 회수 기준 조회
  http.get("/core-api/v1/core/admin/revoke/criteria", () => {
    return HttpResponse.json({
      content: REVOKE_CRITERIA_MOCK,
    });
  }),
];
