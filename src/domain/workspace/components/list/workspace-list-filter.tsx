"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  workspacePageAtom,
  workspaceSearchTextAtom,
} from "@/domain/workspace/state/workspace.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface WorkspaceListFilterProps {
  /** 전체 워크스페이스 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 워크스페이스 목록 페이지 상단 필터 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 검색어를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크스페이스 수
 * @param loading - 로딩 상태
 */
export function WorkspaceListFilter({
  total,
  loading,
}: WorkspaceListFilterProps) {
  const setSearchText = useSetAtom(workspaceSearchTextAtom);
  const resetPage = useResetAtom(workspacePageAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="워크스페이스 목록" total={total}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
      />
    </MySearchFilter>
  );
}
