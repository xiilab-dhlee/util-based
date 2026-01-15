import type { DefaultError } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type {
  AccountWithGroupsResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGroupSearch } from "@/shared/components/group-member-selector/hooks/use-group-search";

export interface GroupTreeSearchState {
  searchText: string;
  onSearchTextChange: (nextValue: string) => void;
  onSearchSubmit: () => void;
  onSearchClear: () => void;
  resetSearchState: () => void;
  expandedSearchGroupIds: Set<string>;
  setExpandedSearchGroupIds: Dispatch<SetStateAction<Set<string>>>;
  searchResults: {
    groups: GroupSummaryResponse[];
    accounts: AccountWithGroupsResponse[];
  } | null;
  isSearching: boolean;
  searchError: DefaultError | null;
  searchKeyword: string;
}

export function useGroupTreeSearchState(): GroupTreeSearchState {
  const [searchText, setSearchText] = useState("");
  const [expandedSearchGroupIds, setExpandedSearchGroupIds] = useState<
    Set<string>
  >(new Set());

  const {
    searchResults,
    isSearching,
    searchError,
    searchKeyword,
    executeSearch,
    clearSearch,
  } = useGroupSearch();

  const onSearchTextChange = (nextValue: string) => {
    setSearchText(nextValue);
  };

  const onSearchSubmit = () => {
    if (searchText.trim()) {
      executeSearch(searchText);
      setExpandedSearchGroupIds(new Set());
      return;
    }

    clearSearch();
    setSearchText("");
  };

  const onSearchClear = () => {
    setSearchText("");
    clearSearch();
    setExpandedSearchGroupIds(new Set());
  };

  const resetSearchState = () => {
    onSearchClear();
  };

  return {
    searchText,
    onSearchTextChange,
    onSearchSubmit,
    onSearchClear,
    resetSearchState,
    expandedSearchGroupIds,
    setExpandedSearchGroupIds,
    searchResults,
    isSearching,
    searchError,
    searchKeyword,
  };
}
