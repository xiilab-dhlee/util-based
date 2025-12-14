"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { reportReservationKeys } from "@/domain/report-reservation/constants/report-reservation.key";
import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import type { GetReservationsPayload } from "@/domain/report-reservation/types/report-reservation.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 예약 목록 조회 훅
 */
export const useGetReservations = (
  payload: GetReservationsPayload,
): UseQueryResult<CoreListResponse<ReservationListType>, Error> => {
  const { reportReservationService } = useServices();

  return useQuery({
    queryKey: reportReservationKeys.reservations(payload),
    queryFn: async () => {
      const response = await reportReservationService.getReservations(payload);
      return response.data;
    },
  });
};
