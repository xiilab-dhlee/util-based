import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { requestImageKeys } from "@/constants/request-image/request-image.key";
import { useServices } from "@/providers/service-provider";
import type { RequestImageListType } from "@/schemas/request-image.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetRequestImagesPayload } from "@/types/request-image/request-image.type";

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
