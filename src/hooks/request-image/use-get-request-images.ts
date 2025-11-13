import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import requestImageKeys from "@/constants/request-image/request-image.key";
import { useServices } from "@/providers/service-provider";
import type { GetRequestImagesPayload } from "@/types/request-image/request-image.type";

/**
 * 이미지 요청 목록 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
 */
export const useGetRequestImages = (
  payload: GetRequestImagesPayload,
): UseQueryResult<any, Error> => {
  const { requestImageService } = useServices();

  return useQuery({
    queryKey: requestImageKeys.list(payload),
    queryFn: async () => {
      const response = await requestImageService.getList(payload);
      return response.data;
    },
  });
};

