"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { reportReservationKeys } from "@/domain/report-reservation/constants/report-reservation.key";
import type { DispatchHistoryType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import type { GetDispatchHistoriesPayload } from "@/domain/report-reservation/types/report-reservation.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 발송 내역 목록 조회 훅
 */
export const useGetDispatchHistories = (
  payload: GetDispatchHistoriesPayload,
): UseQueryResult<CoreListResponse<DispatchHistoryType>, Error> => {
  const { reportReservationService } = useServices();

  return useQuery({
    queryKey: reportReservationKeys.dispatchHistories(payload),
    queryFn: async () => {
      const response =
        await reportReservationService.getDispatchHistories(payload);
      return response.data;
    },
  });
};
