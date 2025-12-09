import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import type { SmtpIdType } from "@/domain/system-setting/schemas/smtp.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * SMTP 설정 삭제
 */
export const useDeleteSmtp = (): UseMutationResult<
  unknown,
  Error,
  SmtpIdType,
  unknown
> => {
  const { smtpService } = useServices();

  return useMutation({
    mutationKey: smtpKeys.delete(),
    mutationFn: (id: SmtpIdType) => {
      return smtpService.deleteSmtp(id);
    },
  });
};
