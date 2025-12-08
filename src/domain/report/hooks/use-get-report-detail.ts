"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { reportKeys } from "@/domain/report/constants/report.key";
import type { ReportDetailResponse } from "@/domain/report/schemas/report-detail.schema";
import { reportDetailResponseSchema } from "@/domain/report/schemas/report-detail.schema";
import { useServices } from "@/shared/providers/service-provider";

export const useGetReportDetail = (
  reportId: string,
): UseQueryResult<ReportDetailResponse, Error> => {
  const { reportService } = useServices();

  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: async () => {
      const response = await reportService.getDetail(reportId);
      return reportDetailResponseSchema.parse(response.data);
    },
    enabled: !!reportId,
  });
};
