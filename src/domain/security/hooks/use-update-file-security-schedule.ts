import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { fileSecurityKeys } from "@/domain/security/constants/file-security.key";
import type { UpdateSecurityScheduleSettingPayload } from "@/domain/security/types/file-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 파일 보안 스케줄 설정 업데이트
 */
export const useUpdateFileSecuritySchedule = (): UseMutationResult<
  unknown,
  Error,
  UpdateSecurityScheduleSettingPayload,
  unknown
> => {
  const { fileSecurityService } = useServices();

  return useMutation({
    mutationKey: fileSecurityKeys.updateSecuritySchedule(),
    mutationFn: (payload: UpdateSecurityScheduleSettingPayload) => {
      return fileSecurityService.updateSecurityScheduleSetting(payload);
    },
  });
};
