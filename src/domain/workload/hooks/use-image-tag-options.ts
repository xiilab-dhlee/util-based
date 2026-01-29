import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { getPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import { getPublicImageTagList } from "@/api/generated/public-registry/public-registry";
import {
  IMAGE_TAG_QUERY_KEY,
  REGISTRY_PAGE_SIZE,
} from "@/domain/workload/constants/registry.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

interface UseImageTagOptionsParams {
  registryType: "PRIVATE" | "PUBLIC";
  harborImageName: string | null;
  keyword: string;
}

interface UseImageTagOptionsReturn {
  options: Array<{ label: string; value: string }>;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}

export function useImageTagOptions({
  registryType,
  harborImageName,
  keyword,
}: UseImageTagOptionsParams): UseImageTagOptionsReturn {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const query = useInfiniteQuery({
    queryKey: [
      IMAGE_TAG_QUERY_KEY,
      registryType,
      harborImageName,
      keyword,
      REGISTRY_PAGE_SIZE,
      workspaceId,
    ],

    queryFn: ({ pageParam = 0, signal }) => {
      if (!harborImageName) {
        throw new Error("harborImageName is required");
      }

      const params = {
        pageNo: pageParam,
        pageSize: REGISTRY_PAGE_SIZE,
        keyword: keyword || undefined,
        harborImageName,
        workspaceId,
        usableOnly: true, // 사용 가능한 태그만 조회
      };

      // API 분기: PRIVATE는 private, PUBLIC는 public
      return registryType === "PRIVATE"
        ? getPrivateImageTagList(params, signal)
        : getPublicImageTagList(params, signal);
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },

    initialPageParam: 0,

    // Cascade 로직: harborImageName이 있을 때만 쿼리 실행
    enabled: !!(harborImageName && workspaceId),

    // Response 변환: 드롭다운 옵션 형식으로
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page?.content?.map((item) => ({
            label: item.imageTagName, // 태그명 (예: "latest", "v1.0.0")
            value: item.imageTagName, // 태그명 저장
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
