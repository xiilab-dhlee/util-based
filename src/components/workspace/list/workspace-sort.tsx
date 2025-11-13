"use client";

import { useAtom } from "jotai";

import { workspaceSortAtom } from "@/atoms/workspace/workspace-list.atom";
import { MySelect } from "@/components/common/select";
import workspaceListConstants from "@/constants/workspace/workspace-list.constant";

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
  // Jotai atom을 사용하여 워크스페이스 정렬 기준 관리
  const [sortBy, setSortBy] = useAtom(workspaceSortAtom);

  /**
   * 정렬 기준 선택 변경 핸들러
   *
   * @param value - 선택된 정렬 기준 값 (string | null)
   */
  const handleChange = (value: string | null) => {
    if (value) {
      setSortBy(value);
    }
  };

  return (
    <MySelect
      options={workspaceListConstants.sort} // 워크스페이스 정렬 옵션들
      placeholder="정렬" // 플레이스홀더 텍스트
      setValue={handleChange} // 값 변경 핸들러
      value={sortBy} // 현재 선택된 정렬 기준 값
      width={160} // 선택기 너비
      height={30} // 선택기 높이
    />
  );
}

