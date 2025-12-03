import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { registrySecurityKeys } from "@/domain/security/constants/registry-security.key";
import type { UpdateSecurityLevelSettingPayload } from "@/domain/security/types/registry-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 레지스트리 보안 레벨 설정 업데이트
 */
export const useUpdateRegistrySecurityLevel = (): UseMutationResult<
  unknown,
  Error,
  UpdateSecurityLevelSettingPayload,
  unknown
> => {
  const { registrySecurityService } = useServices();

  return useMutation({
    mutationKey: registrySecurityKeys.updateSecurityLevel(),
    mutationFn: (payload: UpdateSecurityLevelSettingPayload) => {
      return registrySecurityService.updateSecurityLevelSetting(payload);
    },
  });
};
