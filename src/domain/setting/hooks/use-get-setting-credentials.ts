import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import type { GetCredentialsPayload } from "@/domain/credential/types/credential.type";
import { settingKeys } from "@/domain/setting/constants/setting.key";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 설정 크리덴셜 목록 조회
 */
export const useGetSettingCredentials = (
  payload: GetCredentialsPayload,
): UseQueryResult<CoreListResponse<CredentialListType>, Error> => {
  const { credentialService } = useServices();

  return useQuery({
    queryKey: settingKeys.credentialList(payload),
    queryFn: async () => {
      const response = await credentialService.getList(payload);
      return response.data;
    },
  });
};
