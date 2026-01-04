"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  hubPageAtom,
  hubSearchKeywordAtom,
  hubSearchTextAtom,
} from "@/domain/hub/state/hub.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface HubListFilterProps {
  total: number;
  loading: boolean;
}

/**
 * HubListFilter 컴포넌트
 *
 * 허브 목록 페이지 상단의 필터 컴포넌트입니다.
 * 허브 검색 기능과 목록 표시를 위한 헤더 역할을 수행합니다.
 */
export function HubListFilter({ total, loading }: HubListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(hubSearchKeywordAtom);
  const setSearchText = useSetAtom(hubSearchTextAtom);
  const resetPage = useResetAtom(hubPageAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 목록 페이지로 이동
   * (목록 페이지에서 자동으로 첫 번째 허브로 리다이렉트됨)
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="허브 목록" total={total}>
      <SearchInput
        disabled={loading}
        onSearch={handleSearch}
        value={searchKeyword}
        onChange={setSearchKeyword}
      />
    </MySearchFilter>
  );
}
