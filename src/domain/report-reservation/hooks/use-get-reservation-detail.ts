"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { reportReservationKeys } from "@/domain/report-reservation/constants/report-reservation.key";
import type { ReservationDetailType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { reservationDetailResponseSchema } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 예약 상세 조회 훅
 *
 * @param reservationId - 예약 ID
 * @returns 예약 상세 데이터
 */
export const useGetReservationDetail = (
  reservationId: string | null,
): UseQueryResult<ReservationDetailType, Error> => {
  const { reportReservationService } = useServices();

  return useQuery<ReservationDetailType, Error>({
    queryKey: reportReservationKeys.reservationDetail(reservationId ?? ""),
    queryFn: async () => {
      const response = await reportReservationService.getReservationDetail({
        reservationId: reservationId as string,
      });
      return reservationDetailResponseSchema.parse(response.data);
    },
    enabled: !isNil(reservationId) && reservationId !== "",
  });
};
