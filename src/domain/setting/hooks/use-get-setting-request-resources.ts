import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import type { GetWorkspaceRequestResourcesPayload } from "@/domain/workspace/types/workspace.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";
import { settingKeys } from "../constants/setting.key";

/**
 * 설정 리소스 요청 목록 조회
 */
export const useGetSettingRequestResources = (
  payload: GetWorkspaceRequestResourcesPayload,
): UseQueryResult<CoreListResponse<RequestResourceListType>, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: settingKeys.requestResourceList(payload),
    queryFn: async () => {
      const response = await workspaceService.getRequestResourceList(payload);
      return response.data;
    },
  });
};
