import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { CoreFileListResponse } from "@/types/common/core.model";
import type { GetWorkloadFilesPayload } from "@/types/workload/workload.type";

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
