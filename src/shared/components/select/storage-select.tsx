"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { DropdownProps } from "xiilab-ui";
import { Dropdown } from "xiilab-ui";

import { getStorages } from "@/api/generated/storage/storage";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

const QUERY_KEY = "storage-select";
const PAGE_SIZE = 30;

type StorageSelectProps = Omit<
  DropdownProps,
  "options" | "loading" | "onPopupScroll"
>;

/**
 * 스토리지 목록을 무한 스크롤로 조회하는 커스텀 훅
 */
function useStorageOptions() {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY, PAGE_SIZE],
    queryFn: ({ pageParam = 0, signal }) =>
      getStorages(
        {
          pageNo: pageParam,
          pageSize: PAGE_SIZE,
        },
        signal,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },
    initialPageParam: 0,
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page?.content?.map((storage) => ({
            label: storage.storageName,
            value: storage.storageId,
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

/**
 * 스토리지 목록 선택 컴포넌트
 *
 * 무한 스크롤을 통해 스토리지 목록을 페이지 단위로 조회하고
 * Dropdown 컴포넌트로 표시합니다.
 */
export function StorageSelect(props: StorageSelectProps) {
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useStorageOptions();
  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <Dropdown
      {...props}
      options={options}
      loading={isLoading || isFetchingNextPage}
      onPopupScroll={handlePopupScroll}
      placeholder={props.placeholder ?? "스토리지를 선택해 주세요."}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
