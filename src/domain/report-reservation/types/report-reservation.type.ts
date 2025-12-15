import type { ReportType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";

/**
 * 예약 목록 조회 페이로드
 */
export interface GetReservationsPayload extends CorePayload, CorePaginate {
  /** 리포트 종류 필터 (SYSTEM | CLUSTER) */
  reportType?: ReportType;
}

/**
 * 발송 내역 조회 페이로드
 */
export interface GetDispatchHistoriesPayload extends CorePayload, CorePaginate {
  /** 리포트 종류 필터 (SYSTEM | CLUSTER) */
  reportType?: ReportType;
}

/**
 * 발송 내역 상세 조회 페이로드
 */
export interface GetDispatchDetailPayload {
  /** 발송 내역 ID */
  dispatchId: string;
}

/**
 * 예약 상세 조회 페이로드
 */
export interface GetReservationDetailPayload {
  /** 예약 ID */
  reservationId: string;
}
