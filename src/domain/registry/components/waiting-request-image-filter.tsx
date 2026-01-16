"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  waitingRequestImagePageAtom,
  waitingRequestImageSearchKeywordAtom,
  waitingRequestImageSearchTextAtom,
} from "@/domain/registry/state/registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface WaitingRequestImageFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function WaitingRequestImageFilter({
  totalSize,
  loading,
}: WaitingRequestImageFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(
    waitingRequestImageSearchKeywordAtom,
  );
  const setSearchText = useSetAtom(waitingRequestImageSearchTextAtom);
  const resetPage = useResetAtom(waitingRequestImagePageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <MySearchFilter
      title="이미지 사용 요청 승인 대기 목록"
      darkMode
      total={totalSize}
    >
      <Input.Search
        name="search"
        placeholder="이미지 이름을 입력해 주세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        darkMode
        value={searchKeyword}
        onChange={handleSearchKeywordChange}
        disabled={loading}
      />
    </MySearchFilter>
  );
}
