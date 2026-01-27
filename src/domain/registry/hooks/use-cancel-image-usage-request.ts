"use client";

import { useQueryClient } from "@tanstack/react-query";

import { getGetUsageRequestListQueryKey } from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request";
import { useCancelUsageRequest } from "@/api/generated/image-tag-usage-request/image-tag-usage-request";
import { getGetPrivateImageTagListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicImageTagListQueryKey } from "@/api/generated/public-registry/public-registry";

/**
 * 이미지 태그 사용 요청 취소 액션 훅
 *
 * 취소 성공 시 사용 요청 목록과 이미지 태그 목록을 자동으로 갱신합니다.
 */
export function useCancelImageUsageRequestAction(
  options?: Parameters<typeof useCancelUsageRequest>[0],
) {
  const queryClient = useQueryClient();

  return useCancelUsageRequest({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        // 사용 요청 목록 갱신
        queryClient.invalidateQueries({
          queryKey: getGetUsageRequestListQueryKey(),
        });
        // 이미지 태그 목록 갱신 (승인 상태가 변경되므로)
        queryClient.invalidateQueries({
          queryKey: getGetPublicImageTagListQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPrivateImageTagListQueryKey(),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}
