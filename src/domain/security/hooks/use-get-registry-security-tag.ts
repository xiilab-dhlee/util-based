import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { registrySecurityKeys } from "@/domain/security/constants/registry-security.key";
import type { GetRegistrySecurityTagDetailPayload } from "@/domain/security/types/registry-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 레지스트리 보안 이미지 태그 상세 조회
 */
export const useGetRegistrySecurityTag = (
  payload: GetRegistrySecurityTagDetailPayload,
): UseQueryResult<ImageTagListResponse, Error> => {
  const { registrySecurityService } = useServices();

  return useQuery({
    queryKey: registrySecurityKeys.tagDetail(payload),
    queryFn: async () => {
      const response = await registrySecurityService.getTagDetail(payload);
      return response.data;
    },
    enabled: !isNil(payload.imageId) && !isNil(payload.tagId),
  });
};
