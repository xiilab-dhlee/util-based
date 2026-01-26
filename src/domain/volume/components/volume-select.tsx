"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import type { VolumeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getVolumeList } from "@/api/generated/volume/volume";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

const QUERY_KEY = "volume-select";
const PAGE_SIZE = 30;

interface VolumeSelectProps {
  value: VolumeListResponse | null;
  setValue: Dispatch<SetStateAction<VolumeListResponse | null>>;
}

function useVolumeOptions(keyword: string) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY, workspaceId, keyword, PAGE_SIZE],
    queryFn: ({ pageParam = 0, signal }) =>
      getVolumeList(
        {
          pageNo: pageParam,
          pageSize: PAGE_SIZE,
          keyword: keyword || undefined,
          workspaceId,
        },
        signal,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!workspaceId,
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page.content?.map((volume) => ({
            label: volume.volumeName,
            value: volume.volumeId,
            origin: volume,
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

export function VolumeSelect({ value, setValue }: VolumeSelectProps) {
  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useVolumeOptions(keyword);
  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleChange = (next: number | null) => {
    if (next === null) {
      setValue(null);
      resetKeyword();
      return;
    }

    const selectedOption = options.find((v) => v.origin.volumeId === next);

    if (selectedOption) {
      setValue(selectedOption.origin);
      resetKeyword();
    }
  };

  return (
    <Dropdown
      placeholder="볼륨을 선택해 주세요."
      options={options}
      value={value?.volumeId ?? null}
      onChange={handleChange}
      width="100%"
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      loading={isLoading || isFetchingNextPage}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
