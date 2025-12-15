import { HttpResponse, http } from "msw";

import {
  dispatchDetailMock,
  dispatchDetailMockMap,
  dispatchHistoryListMock,
  reservationDetailMock,
  reservationDetailMockMap,
  reservationListMock,
} from "@/mocks/data/report-reservation.mock";

/**
 * 리포트 예약 API 핸들러
 */
export const reportReservationHandlers = [
  // 예약 목록 조회
  http.get(
    "/core-api/v1/core/report-reservation/reservations",
    ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page")) || 0;
      const size = Number(url.searchParams.get("size")) || 10;

      // 페이지네이션 계산
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = reservationListMock.slice(startIndex, endIndex);

      return HttpResponse.json({
        content: paginatedContent,
        totalSize: reservationListMock.length,
      });
    },
  ),

  // 예약 상세 조회
  http.get(
    "/core-api/v1/core/report-reservation/reservations/:reservationId",
    ({ params }) => {
      const { reservationId } = params;

      // ID 기반 룩업, 존재하지 않으면 기본값 반환
      const detailData =
        reservationDetailMockMap[reservationId as string] ||
        reservationDetailMock;

      // 존재하지 않는 ID인 경우 404 에러 반환 (선택적)
      if (!reservationDetailMockMap[reservationId as string]) {
        // 기본값을 반환하되 ID는 요청된 것으로 설정
        return HttpResponse.json({
          ...reservationDetailMock,
          id: reservationId,
        });
      }

      return HttpResponse.json(detailData);
    },
  ),

  // 발송 내역 조회
  http.get(
    "/core-api/v1/core/report-reservation/dispatch-histories",
    ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page")) || 0;
      const size = Number(url.searchParams.get("size")) || 10;

      // 페이지네이션 계산
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = dispatchHistoryListMock.slice(
        startIndex,
        endIndex,
      );

      return HttpResponse.json({
        content: paginatedContent,
        totalSize: dispatchHistoryListMock.length,
      });
    },
  ),

  // 발송 내역 상세 조회
  http.get(
    "/core-api/v1/core/report-reservation/dispatch-histories/:dispatchId",
    ({ params }) => {
      const { dispatchId } = params;

      // ID 기반 룩업, 존재하지 않으면 기본값 반환
      const detailData =
        dispatchDetailMockMap[dispatchId as string] || dispatchDetailMock;

      // 존재하지 않는 ID인 경우 기본값을 반환하되 ID는 요청된 것으로 설정
      if (!dispatchDetailMockMap[dispatchId as string]) {
        return HttpResponse.json({
          ...dispatchDetailMock,
          id: dispatchId,
        });
      }

      return HttpResponse.json(detailData);
    },
  ),
];
