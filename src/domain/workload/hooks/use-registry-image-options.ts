import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { getPrivateRegistryList } from "@/api/generated/private-registry/private-registry";
import { getPublicRegistryList } from "@/api/generated/public-registry/public-registry";
import {
  REGISTRY_IMAGE_QUERY_KEY,
  REGISTRY_PAGE_SIZE,
} from "@/domain/workload/constants/registry.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

interface UseRegistryImageOptionsParams {
  registryType: "PRIVATE" | "PUBLIC";
  keyword: string;
}

interface UseRegistryImageOptionsReturn {
  options: Array<{ label: string; value: string }>;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/**
 * 레지스트리 이미지 목록 조회 훅 (무한 스크롤 + 검색)
 *
 * @param params - registryType과 keyword
 * @returns 드롭다운 options 및 페이지네이션 상태
 *
 * @example
 * const { options, isLoading, fetchNextPage } = useRegistryImageOptions({
 *   registryType: 'PRIVATE',
 *   keyword: 'pytorch'
 * });
 */
export function useRegistryImageOptions({
  registryType,
  keyword,
}: UseRegistryImageOptionsParams): UseRegistryImageOptionsReturn {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const query = useInfiniteQuery({
    queryKey: [
      REGISTRY_IMAGE_QUERY_KEY,
      registryType,
      keyword,
      REGISTRY_PAGE_SIZE,
    ],

    queryFn: ({ pageParam = 0, signal }) => {
      const params = {
        pageNo: pageParam,
        pageSize: REGISTRY_PAGE_SIZE,
        workspaceId,
      };

      // API 분기: PRIVATE는 private, PUBLIC는 public
      return registryType === "PRIVATE"
        ? getPrivateRegistryList(params, signal)
        : getPublicRegistryList(params, signal);
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },

    initialPageParam: 0,

    // Response 변환: 드롭다운 옵션 형식으로
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page?.content?.map((item) => ({
            label: item.imageDisplayName, // 사용자에게 보여지는 이름
            value: item.harborImageName, // Harbor 이미지 경로 (API 호출에 사용)
          })) ?? [],
      ),
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
