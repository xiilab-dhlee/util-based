import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { reportKeys } from "@/domain/report/constants/report.key";
import type { ReportListType } from "@/domain/report/schemas/report.schema";
import type { GetReportsPayload } from "@/domain/report/types/report.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 리포트 목록 조회
 */
export const useGetReports = (
  payload: GetReportsPayload,
): UseQueryResult<CoreListResponse<ReportListType>, Error> => {
  const { reportService } = useServices();

  return useQuery({
    queryKey: reportKeys.list(payload),
    queryFn: async () => {
      const response = await reportService.getList(payload);
      return response.data;
    },
  });
};
