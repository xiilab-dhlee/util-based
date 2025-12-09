"use client";

import { useSetAtom } from "jotai";
import type { FormEvent } from "react";

import {
  hubSearchTextAtom,
  hubSelectedAtom,
} from "@/domain/hub/state/hub.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

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
  // 허브 선택 상태를 초기화하기 위한 atom setter
  const setSelectedHub = useSetAtom(hubSelectedAtom);

  // 검색 기능 훅
  const { onSubmit } = useSearch(hubSearchTextAtom);

  /**
   * 검색 폼 제출 핸들러
   * 검색 시 선택된 허브를 초기화하고 검색을 실행
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setSelectedHub(-1);
    onSubmit(e);
  };

  return (
    <MySearchFilter title="허브 목록" total={total}>
      <form onSubmit={handleSubmit}>
        <SearchInput disabled={loading} />
      </form>
    </MySearchFilter>
  );
}
