import { debounce } from "es-toolkit";
import { useMemo, useState } from "react";

interface UseDebouncedSearchReturn {
  /** 현재 검색어 (debounce 적용된 값) */
  keyword: string;
  /** 검색어 변경 핸들러 (debounce 적용) */
  handleSearch: (value: string) => void;
  /** 검색어 초기화 */
  resetKeyword: () => void;
}

/**
 * Debounce가 적용된 검색어 관리 훅
 *
 * @param delay debounce 지연 시간 (ms), 기본값 300ms
 * @returns keyword, handleSearch, resetKeyword
 *
 * @example
 * const { keyword, handleSearch } = useDebouncedSearch();
 *
 * <Dropdown
 *   showSearch
 *   filterOption={false}
 *   onSearch={handleSearch}
 * />
 */
export function useDebouncedSearch(delay = 300): UseDebouncedSearchReturn {
  const [keyword, setKeyword] = useState("");

  const debouncedSetKeyword = useMemo(
    () => debounce((value: string) => setKeyword(value), delay),
    [delay],
  );

  const handleSearch = (value: string) => {
    debouncedSetKeyword(value);
  };

  const resetKeyword = () => {
    setKeyword("");
  };

  return {
    keyword,
    handleSearch,
    resetKeyword,
  };
}
