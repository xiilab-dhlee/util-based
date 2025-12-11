import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import type {
  CreateSmtpRequestPayload,
  SmtpResponse,
} from "@/domain/system-setting/schemas/smtp.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * SMTP 설정 생성
 */
export const useCreateSmtp = (): UseMutationResult<
  AxiosResponse<SmtpResponse>,
  Error,
  CreateSmtpRequestPayload,
  unknown
> => {
  const { smtpService } = useServices();

  return useMutation({
    mutationKey: smtpKeys.create(),
    mutationFn: (payload: CreateSmtpRequestPayload) => {
      return smtpService.createSmtp(payload);
    },
  });
};
