"use client";

import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import {
  sourcecodeCheckedListAtom,
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
} from "@/atoms/sourcecode.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetSourcecodes } from "@/hooks/sourcecode/use-get-sourcecodes";
import type { SourcecodeListType } from "@/schemas/sourcecode.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 소스코드 목록 전체 선택 체크박스 컴포넌트
 *
 * 현재 페이지의 모든 소스코드를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 sourcecodeCheckedListAtom으로 관리됩니다.
 *
 * @returns 전체 선택 체크박스 컴포넌트
 */
export function SourcecodeAllCheck() {
  const [checkedList, setCheckedList] = useAtom(sourcecodeCheckedListAtom);
  const page = useAtomValue(sourcecodePageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);

  // 현재 페이지의 소스코드 목록 조회
  const { data } = useGetSourcecodes({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 현재 페이지의 소스코드 ID 목록
  const currentPageIds: number[] = useMemo(() => {
    return data?.content?.map((v: SourcecodeListType) => v.id) || [];
  }, [data?.content]);

  // 현재 페이지의 모든 소스코드가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 소스코드가 선택되었는지 확인 (indeterminate 상태)
  const isIndeterminate = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    const checkedCount = currentPageIds.filter((id) =>
      checkedList.has(id),
    ).length;
    return checkedCount > 0 && checkedCount < currentPageIds.length;
  }, [currentPageIds, checkedList]);

  // 전체 선택/해제 처리
  const handleSelectAll = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        // 현재 페이지의 모든 소스코드 선택
        currentPageIds.forEach((id) => {
          next.add(id);
        });
      } else {
        // 현재 페이지의 모든 소스코드 선택 해제
        currentPageIds.forEach((id) => {
          next.delete(id);
        });
      }

      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isAllChecked}
        indeterminate={isIndeterminate}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}
