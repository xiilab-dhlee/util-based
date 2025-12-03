import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { fileSecurityKeys } from "@/domain/security/constants/file-security.key";
import type { UpdateSecurityLevelSettingPayload } from "@/domain/security/types/file-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 파일 보안 레벨 설정 업데이트
 */
export const useUpdateFileSecurityLevel = (): UseMutationResult<
  unknown,
  Error,
  UpdateSecurityLevelSettingPayload,
  unknown
> => {
  const { fileSecurityService } = useServices();

  return useMutation({
    mutationKey: fileSecurityKeys.updateSecurityLevel(),
    mutationFn: (payload: UpdateSecurityLevelSettingPayload) => {
      return fileSecurityService.updateSecurityLevelSetting(payload);
    },
  });
};
