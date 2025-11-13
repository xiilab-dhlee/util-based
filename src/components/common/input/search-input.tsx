"use client";

import type { InputProps } from "xiilab-ui";
import { Input } from "xiilab-ui";

interface SearchInputProps {
  width?: InputProps["width"];
  placeholder?: string;
  darkMode?: boolean;
}

// 검색 입력 컴포넌트
export function SearchInput({
  placeholder = "검색어를 입력하세요.",
  width = 220,
  darkMode = false,
}: SearchInputProps) {
  const handleSearch = () => {
    // 현재 SearchInput이 포함된 form 요소 찾기
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
      const formElement = searchInput.closest("form");
      if (formElement) {
        // form submit 이벤트 발생
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        formElement.dispatchEvent(submitEvent);
      }
    }
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
    />
  );
}

