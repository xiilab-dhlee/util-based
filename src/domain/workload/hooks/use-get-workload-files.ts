import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { GetWorkloadFilesPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreFileListResponse } from "@/shared/types/core.model";

/**
 * 워크로드 파일 목록 조회
 */
export const useGetWorkloadFiles = (
  payload: GetWorkloadFilesPayload,
): UseQueryResult<CoreFileListResponse, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.fileList(payload),
    queryFn: async () => {
      const response = await workloadService.getFileList(payload);
      return response.data;
    },
  });
};
