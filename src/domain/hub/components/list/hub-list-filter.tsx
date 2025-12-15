"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  hubPageAtom,
  hubSearchTextAtom,
  hubSelectedAtom,
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
  const setSelectedHub = useSetAtom(hubSelectedAtom);
  const setSearchText = useSetAtom(hubSearchTextAtom);
  const resetPage = useResetAtom(hubPageAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지와 선택된 허브를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSelectedHub(-1);
    setSearchText(value);
  };

  return (
    <MySearchFilter title="허브 목록" total={total}>
      <SearchInput disabled={loading} onSearch={handleSearch} />
    </MySearchFilter>
  );
}
