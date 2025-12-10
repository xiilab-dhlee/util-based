import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type {
  WorkspaceResourceSettingRequestType,
  WorkspaceResourceSettingResponseType,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크스페이스 리소스 설정 업데이트
 */
export const useUpdateWorkspaceResourceSetting = (): UseMutationResult<
  WorkspaceResourceSettingResponseType,
  Error,
  WorkspaceResourceSettingRequestType,
  unknown
> => {
  const { workspaceResourceSettingService } = useServices();

  return useMutation({
    mutationFn: (payload: WorkspaceResourceSettingRequestType) => {
      return workspaceResourceSettingService.updateWorkspaceResourceSetting(
        payload,
      );
    },
  });
};
