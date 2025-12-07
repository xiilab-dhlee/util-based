import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import { useServices } from "@/shared/providers/service-provider";

/**
 * SMTP 설정 삭제
 */
export const useDeleteSmtp = (): UseMutationResult<
  unknown,
  Error,
  number,
  unknown
> => {
  const { smtpService } = useServices();

  return useMutation({
    mutationKey: smtpKeys.delete(),
    mutationFn: (id: number) => {
      return smtpService.deleteSmtp(id);
    },
  });
};
