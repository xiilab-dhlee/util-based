"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  waitingRequestImagePageAtom,
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
  const setSearchText = useSetAtom(waitingRequestImageSearchTextAtom);
  const resetPage = useResetAtom(waitingRequestImagePageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
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
        disabled={loading}
      />
    </MySearchFilter>
  );
}
