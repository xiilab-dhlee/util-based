"use client";

import { workspaceSearchTextAtom } from "@/domain/workspace/state/workspace.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

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
  const { onSubmit } = useSearch(workspaceSearchTextAtom);

  return (
    <MySearchFilter title="워크스페이스 목록" total={total}>
      <form onSubmit={onSubmit}>
        <SearchInput disabled={loading} />
      </form>
    </MySearchFilter>
  );
}
