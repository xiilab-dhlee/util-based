"use client";

import { useAtomValue, useSetAtom } from "jotai";
// 향후 검색 기능 구현 시 사용될 타입들
import type { FormEvent } from "react";

import {
  hubPageAtom,
  hubSearchTextAtom,
  hubSelectedAtom,
} from "@/atoms/hub.atom";
// 향후 검색 기능 구현 시 사용될 컴포넌트
import { SearchInput } from "@/components/common/input/search-input";
import { CARD_PAGE_SIZE } from "@/constants/common/core.constant";
import { useSearch } from "@/hooks/common/use-search";
import { useGetHubs } from "@/hooks/hub/use-get-hubs";
import { MySearchFilter } from "@/layouts/common/search-filter";

/**
 * HubListFilter 컴포넌트
 *
 * 허브 목록 페이지 상단의 필터 컴포넌트입니다.
 * 허브 검색 기능과 목록 표시를 위한 헤더 역할을 수행합니다.
 * 현재는 기본적인 검색 필터 UI만 제공하며, 향후 검색 기능이 구현될 예정입니다.
 *
 * 주요 기능:
 * - 허브 목록 페이지 헤더 표시
 * - 검색 필터 UI 제공 (현재 비활성화 상태)
 * - 허브 선택 상태 초기화 기능
 * - 총 허브 개수 표시
 *
 * 상태 관리:
 * - hubSelectedAtom: 현재 선택된 허브 상태 관리
 * - hubSearchTextAtom: 허브 검색어 상태 관리
 * - useSearch: 검색 기능 훅 (현재 미사용)
 *
 * @returns 허브 목록 페이지 상단 필터 컴포넌트 JSX 요소
 */
export function HubListFilter() {
  // 허브 선택 상태를 초기화하기 위한 atom setter
  const setSelectedHub = useSetAtom(hubSelectedAtom);

  // 검색 기능 훅 (현재 미사용 상태)
  const { onSubmit } = useSearch(hubSearchTextAtom);

  // 현재 페이지 번호 (Jotai atom에서 관리)
  const page = useAtomValue(hubPageAtom);

  // 검색 텍스트 (Jotai atom에서 관리)
  const searchText = useAtomValue(hubSearchTextAtom);

  // 허브 목록 데이터 조회 (React Query 훅 사용)
  const { data } = useGetHubs({
    page,
    size: CARD_PAGE_SIZE,
    searchText,
  });

  /**
   * 검색 폼 제출 핸들러 (현재 주석 처리됨)
   * 검색 시 선택된 허브를 초기화하고 검색을 실행하는 기능
   * 향후 검색 기능 구현 시 활성화 예정
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setSelectedHub(-1);
    onSubmit(e);
  };

  return (
    <MySearchFilter title="허브 목록" total={data?.totalSize}>
      <form onSubmit={handleSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
