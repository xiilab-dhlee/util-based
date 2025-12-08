import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import type { SmtpResponseType } from "@/domain/system-setting/schemas/smtp.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * SMTP 설정 조회
 */
export const useGetSmtp = (): UseQueryResult<SmtpResponseType, Error> => {
  const { smtpService } = useServices();

  return useQuery({
    queryKey: smtpKeys.detail(),
    queryFn: async () => {
      const response = await smtpService.getSmtp();
      return response.data;
    },
  });
};
