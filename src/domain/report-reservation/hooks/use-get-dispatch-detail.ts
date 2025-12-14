"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { reportReservationKeys } from "@/domain/report-reservation/constants/report-reservation.key";
import type { DispatchDetailResponse } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { dispatchDetailResponseSchema } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 발송 내역 상세 조회 훅
 */
export const useGetDispatchDetail = (
  dispatchId: string,
): UseQueryResult<DispatchDetailResponse, Error> => {
  const { reportReservationService } = useServices();

  return useQuery<DispatchDetailResponse, Error>({
    queryKey: reportReservationKeys.dispatchDetail(dispatchId),
    queryFn: async () => {
      const response = await reportReservationService.getDispatchDetail({
        dispatchId,
      });
      return dispatchDetailResponseSchema.parse(response.data);
    },
    enabled: !isNil(dispatchId) && dispatchId !== "",
  });
};
