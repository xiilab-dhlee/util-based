import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { requestImageKeys } from "@/domain/request-image/constants/request-image.key";
import type { RequestImageListType } from "@/domain/request-image/schemas/request-image.schema";
import type { GetRequestImagesPayload } from "@/domain/request-image/types/request-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 이미지 요청 목록 조회
 *
 */
export const useGetRequestImages = (
  payload: GetRequestImagesPayload,
): UseQueryResult<CoreListResponse<RequestImageListType>, Error> => {
  const { requestImageService } = useServices();

  return useQuery({
    queryKey: requestImageKeys.list(payload),
    queryFn: async () => {
      const response = await requestImageService.getList(payload);
      return response.data;
    },
  });
};
