"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Dropdown } from "xiilab-ui";

import { getCredentials } from "@/api/generated/credential/credential";
import type { CredentialIdType } from "@/domain/credential/schemas/credential.schema";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

// ============================================================================
// 상수
// ============================================================================

const QUERY_KEY = "credential-select";
const PAGE_SIZE = 30;

// ============================================================================
// 타입
// ============================================================================

interface CredentialSelectProps {
  value: CredentialIdType | null;
  setValue: (value: CredentialIdType | null) => void;
}

// ============================================================================
// 훅
// ============================================================================

function useCredentialOptions(keyword: string) {
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY, accountId, keyword, PAGE_SIZE],
    queryFn: ({ pageParam = 0, signal }) =>
      getCredentials(
        accountId,
        {
          pageNo: pageParam,
          pageSize: PAGE_SIZE,
          keyword: keyword || undefined,
        },
        signal,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!accountId,
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page.content?.map((c) => ({
            label: c.credentialName,
            value: c.credentialId,
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

// ============================================================================
// 컴포넌트
// ============================================================================

export function CredentialSelect({ value, setValue }: CredentialSelectProps) {
  const { keyword, handleSearch } = useDebouncedSearch();
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCredentialOptions(keyword);
  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleChange = (v: string | number) => {
    if (typeof v === "number") {
      setValue(v);
    }
  };

  return (
    <Dropdown
      placeholder="크리덴셜을 선택해 주세요."
      options={options}
      value={value}
      onChange={handleChange}
      width="100%"
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      loading={isLoading || isFetchingNextPage}
      listHeight={170}
    />
  );
}
