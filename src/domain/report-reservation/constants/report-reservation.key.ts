import type {
  GetDispatchHistoriesPayload,
  GetReservationsPayload,
} from "@/domain/report-reservation/types/report-reservation.type";

export const reportReservationKeys = {
  default: ["report-reservation"],
  reservations: (payload: GetReservationsPayload) => [
    ...reportReservationKeys.default,
    "reservations",
    payload,
  ],
  reservationDetail: (reservationId: string) => [
    ...reportReservationKeys.default,
    "reservation-detail",
    reservationId,
  ],
  dispatchHistories: (payload: GetDispatchHistoriesPayload) => [
    ...reportReservationKeys.default,
    "dispatch-histories",
    payload,
  ],
  dispatchDetail: (dispatchId: string) => [
    ...reportReservationKeys.default,
    "dispatch-detail",
    dispatchId,
  ],
};
