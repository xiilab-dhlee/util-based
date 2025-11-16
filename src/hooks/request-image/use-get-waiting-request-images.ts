import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { requestImageKeys } from "@/constants/request-image/request-image.key";
import { useServices } from "@/providers/service-provider";
import type { RequestImageListType } from "@/schemas/request-image.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetWaitingRequestImagesPayload } from "@/types/request-image/request-image.type";

/**
 * 이미지 요청 승인 대기 목록 조회
 */
export const useGetWaitingRequestImages = (
  payload: GetWaitingRequestImagesPayload,
): UseQueryResult<CoreListResponse<RequestImageListType>, Error> => {
  const { requestImageService } = useServices();

  return useQuery({
    queryKey: requestImageKeys.waitingList(payload),
    queryFn: async () => {
      const response = await requestImageService.getWaitingList(payload);
      return response.data;
    },
  });
};
