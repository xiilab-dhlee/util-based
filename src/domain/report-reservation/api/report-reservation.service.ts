import type {
  DispatchDetailResponse,
  DispatchHistoryType,
  ReservationDetailType,
  ReservationListType,
} from "@/domain/report-reservation/schemas/report-reservation.schema";
import type {
  GetDispatchDetailPayload,
  GetDispatchHistoriesPayload,
  GetReservationDetailPayload,
  GetReservationsPayload,
} from "@/domain/report-reservation/types/report-reservation.type";
import { AxiosService } from "@/shared/api/axios";
import type { CoreListResponse } from "@/shared/types/core.model";
import { payloadToParams } from "@/shared/utils/service.util";

export class ReportReservationService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/report-reservation";

  /** 예약 목록 조회 */
  public getReservations(payload: GetReservationsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get<CoreListResponse<ReservationListType>>(
      `${this.BASE_URL}/reservations`,
      {
        params,
      },
    );
  }

  /** 예약 상세 조회 */
  public getReservationDetail(payload: GetReservationDetailPayload) {
    return this.getAxios().get<ReservationDetailType>(
      `${this.BASE_URL}/reservations/${payload.reservationId}`,
    );
  }

  /** 발송 내역 조회 */
  public getDispatchHistories(payload: GetDispatchHistoriesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get<CoreListResponse<DispatchHistoryType>>(
      `${this.BASE_URL}/dispatch-histories`,
      {
        params,
      },
    );
  }

  /** 발송 내역 상세 조회 */
  public getDispatchDetail(payload: GetDispatchDetailPayload) {
    return this.getAxios().get<DispatchDetailResponse>(
      `${this.BASE_URL}/dispatch-histories/${payload.dispatchId}`,
    );
  }
}
