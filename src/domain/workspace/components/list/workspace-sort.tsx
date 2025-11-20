"use client";

import { useAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { WORKSPACE_SORT_OPTIONS } from "@/domain/workspace/constants/workspace.constant";
import { workspaceSortAtom } from "@/domain/workspace/state/workspace.atom";

/**
 * 워크스페이스 정렬 컴포넌트
 *
 * 워크스페이스 목록에서 다양한 기준으로 정렬할 수 있는 드롭다운 선택기를 제공합니다.
 * 생성일, Memory 할당량/사용량, GPU 할당량/사용량, CPU 할당량/사용량,
 * 사용자 이름, 워크스페이스 이름 등의 기준으로 정렬할 수 있습니다.
 *
 * @returns 워크스페이스 정렬 선택 드롭다운 컴포넌트
 */
export function WorkspaceSort() {
  const [sortBy, setSortBy] = useAtom(workspaceSortAtom);

  /**
   * 정렬 기준 선택 변경 핸들러
   *
   * @param value - 선택된 정렬 기준 값 (string | null)
   */
  const handleChange = (value: string | null) => {
    setSortBy(value);
  };

  return (
    <Dropdown
      options={WORKSPACE_SORT_OPTIONS}
      placeholder="정렬"
      onChange={handleChange}
      value={sortBy}
      width={160}
      height={30}
    />
  );
}
