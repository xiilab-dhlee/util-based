"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import type { SourceCodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getSourceCodeList } from "@/api/generated/source-code/source-code";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

const QUERY_KEY = "sourcecode-select";
const PAGE_SIZE = 30;

interface SourcecodeSelectProps {
  value: SourceCodeListResponse | null;
  setValue: Dispatch<SetStateAction<SourceCodeListResponse | null>>;
}

function useSourcecodeOptions(keyword: string) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY, workspaceId, keyword, PAGE_SIZE],
    queryFn: ({ pageParam = 0, signal }) =>
      getSourceCodeList(
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
          page?.content?.map((sourcecode) => ({
            label: sourcecode.sourceCodeName,
            value: sourcecode.sourceCodeId,
            origin: sourcecode,
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

export function SourcecodeSelect({ value, setValue }: SourcecodeSelectProps) {
  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSourcecodeOptions(keyword);
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

    const selectedOption = options.find((v) => v.origin.sourceCodeId === next);

    if (selectedOption) {
      setValue(selectedOption.origin);
      resetKeyword();
    }
  };

  return (
    <Dropdown
      placeholder="소스코드를 선택해 주세요."
      options={options}
      value={value?.sourceCodeId ?? null}
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
