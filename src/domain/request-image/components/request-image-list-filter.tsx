"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import { RequestImageApproveStatusSort } from "@/domain/request-image/components/request-image-approve-status-sort";
import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
  requestImageWorkspaceIdAtom,
} from "@/domain/request-image/state/request-image.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { WorkspaceFilterSelect } from "@/shared/components/select/workspace-filter-select";

interface RequestImageListFilterProps {
  total: number;
  loading: boolean;
}

/**
 * 이미지 요청 목록 페이지 상단 필터 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 요청 수
 * @param loading - 로딩 상태
 * @returns 이미지 요청 목록 페이지 상단 필터 컴포넌트
 */
export function RequestImageListFilter({
  total,
  loading,
}: RequestImageListFilterProps) {
  const setSearchText = useSetAtom(requestImageSearchTextAtom);
  const resetPage = useResetAtom(requestImagePageAtom);
  const [workspaceId, setWorkspaceId] = useAtom(requestImageWorkspaceIdAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  /**
   * 워크스페이스 변경 핸들러
   * 워크스페이스 변경 시 페이지를 초기화
   */
  const handleWorkspaceChange = (value: number | null) => {
    resetPage();
    setWorkspaceId(value);
  };

  return (
    <MySearchFilter title="이미지 사용 요청 목록" total={total}>
      <RequestImageApproveStatusSort disabled={loading} />
      <WorkspaceFilterSelect
        value={workspaceId}
        onChange={handleWorkspaceChange}
        width={150}
        height={30}
        disabled={loading}
        allowClear
      />
      <Input.Search
        name="search"
        placeholder="이미지 이름 및 태그를 검색해 주세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={260}
        height={30}
        disabled={loading}
      />
    </MySearchFilter>
  );
}
