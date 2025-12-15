"use client";

import type { InputProps } from "xiilab-ui";
import { Input } from "xiilab-ui";

import { SELECTOR } from "@/shared/constants/selector.constant";

interface SearchInputProps {
  width?: InputProps["width"];
  placeholder?: string;
  darkMode?: boolean;
  disabled?: boolean;
  /** 검색 실행 시 호출되는 콜백 (검색어 값을 직접 전달받음) */
  onSearch?: (value: string) => void;
}

/**
 * 검색 입력 컴포넌트
 *
 * antd Input.Search 기반으로, onSearch 콜백에 검색어 값을 직접 전달합니다.
 * Enter 키 입력 또는 검색 버튼 클릭 시 onSearch가 호출됩니다.
 */
export function SearchInput({
  placeholder = "검색어를 입력하세요.",
  width = 220,
  darkMode = false,
  disabled = false,
  onSearch,
}: SearchInputProps) {
  const handleSearch = (value: string) => {
    onSearch?.(value.trim());
  };

  return (
    <Input.Search
      name="search"
      placeholder={placeholder}
      onSearch={handleSearch}
      autoComplete="off"
      width={width}
      height={30}
      darkMode={darkMode}
      disabled={disabled}
      data-testid={SELECTOR.LIST_SEARCH_INPUT}
    />
  );
}
