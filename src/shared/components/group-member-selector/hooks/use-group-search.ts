import type { DefaultError } from "@tanstack/react-query";
import { useState } from "react";

import type {
  AccountWithGroupsResponse,
  GroupSearchResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useSearch } from "@/api/generated/group/group";

interface UseGroupSearchResult {
  searchResults: {
    groups: GroupSummaryResponse[];
    accounts: AccountWithGroupsResponse[];
  } | null;
  isSearching: boolean;
  searchError: DefaultError | null;
  searchKeyword: string;
  executeSearch: (keyword: string) => void;
  clearSearch: () => void;
}

export function useGroupSearch(): UseGroupSearchResult {
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, isLoading, error } = useSearch<GroupSearchResponse, Error>(
    { keyword: searchKeyword },
    {
      query: {
        enabled: searchKeyword.length > 0,
      },
    },
  );

  const executeSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();
    setSearchKeyword(trimmedKeyword);
  };

  const clearSearch = () => {
    setSearchKeyword("");
  };

  const searchResults =
    searchKeyword && data
      ? {
          groups: data.group || [],
          accounts: data.account || [],
        }
      : null;

  return {
    searchResults,
    isSearching: isLoading,
    searchError: error,
    searchKeyword,
    executeSearch,
    clearSearch,
  };
}
