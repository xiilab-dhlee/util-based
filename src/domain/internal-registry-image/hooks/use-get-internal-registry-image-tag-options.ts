import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { DropdownOption } from "xiilab-ui";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type {
  InternalRegistryImageIdType,
  InternalRegistryImageListType,
} from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 태그 옵션 목록 조회
 */
export const useGetInternalRegistryImageTagOptions = (
  imageId: InternalRegistryImageIdType,
): UseQueryResult<DropdownOption[], Error> => {
  const { internalregistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.allTagList(imageId),
    queryFn: async () => {
      const response = await internalregistryImageService.getTagList({
        page: 1,
        size: 100,
        searchText: "",
        imageId,
      });
      return response.data;
    },
    enabled: !!imageId,
    select: (data) =>
      data.content.map((image: InternalRegistryImageListType) => ({
        label: image.name,
        value: image.id,
      })),
  });
};
