import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import type { UpdateSmtpRequestPayload } from "@/domain/system-setting/schemas/smtp.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * SMTP 설정 수정
 */
export const useUpdateSmtp = (): UseMutationResult<
  unknown,
  Error,
  UpdateSmtpRequestPayload,
  unknown
> => {
  const { smtpService } = useServices();

  return useMutation({
    mutationKey: smtpKeys.update(),
    mutationFn: (payload: UpdateSmtpRequestPayload) => {
      return smtpService.updateSmtp(payload);
    },
  });
};
