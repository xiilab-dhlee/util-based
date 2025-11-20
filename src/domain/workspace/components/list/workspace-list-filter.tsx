"use client";

import { useAtomValue } from "jotai";

import { useGetWorkspaces } from "@/domain/workspace/hooks/use-get-workspaces";
import {
  workspacePageAtom,
  workspaceSearchTextAtom,
} from "@/domain/workspace/state/workspace.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";
import { WorkspaceSort } from "./workspace-sort";

/**
 * 워크스페이스 목록 페이지 상단 필터 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 워크스페이스 목록 페이지 상단 필터 컴포넌트
 */
export function WorkspaceListFilter() {
  const { onSubmit } = useSearch(workspaceSearchTextAtom);

  const page = useAtomValue(workspacePageAtom);

  const searchText = useAtomValue(workspaceSearchTextAtom);

  const { data } = useGetWorkspaces({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="워크스페이스 목록" total={data?.totalSize}>
      <WorkspaceSort />
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
