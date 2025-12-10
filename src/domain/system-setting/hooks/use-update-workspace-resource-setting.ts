import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { WorkspaceResourceSettingService } from "@/domain/system-setting/api/workspace-resource-setting.service";
import type {
  WorkspaceResourceSettingRequestType,
  WorkspaceResourceSettingResponseType,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";

/**
 * 워크스페이스 리소스 설정 업데이트
 */
export const useUpdateWorkspaceResourceSetting = (): UseMutationResult<
  WorkspaceResourceSettingResponseType,
  Error,
  WorkspaceResourceSettingRequestType,
  unknown
> => {
  const service = new WorkspaceResourceSettingService();

  return useMutation({
    mutationFn: (payload: WorkspaceResourceSettingRequestType) => {
      return service.updateWorkspaceResourceSetting(payload);
    },
  });
};
