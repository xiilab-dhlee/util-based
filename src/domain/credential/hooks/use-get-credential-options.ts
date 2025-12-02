import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { DropdownOption } from "xiilab-ui";

import { credentialKeys } from "@/domain/credential/constants/credential.key";
import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 크레덴셜 옵션 목록 조회
 */
export const useGetCredentialOptions = (): UseQueryResult<
  DropdownOption[],
  Error
> => {
  const { credentialService } = useServices();

  return useQuery({
    queryKey: credentialKeys.allList(),
    queryFn: async () => {
      const response = await credentialService.getList({
        page: 1,
        size: 100,
        searchText: "",
      });
      return response.data;
    },
    select: (data) =>
      data.content.map((credential: CredentialListType) => ({
        label: credential.name,
        value: credential.id,
      })),
  });
};
