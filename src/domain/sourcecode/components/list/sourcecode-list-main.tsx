"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { SOURCECODE_DEFAULT_SORT } from "@/domain/sourcecode/constants/sourcecode.constant";
import {
  sourcecodeCheckedListAtom,
  sourcecodeHasMineAtom,
  sourcecodePageAtom,
  sourcecodeSearchKeywordAtom,
  sourcecodeSearchTextAtom,
  sourcecodeSortAtom,
  sourcecodeTypeSortAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

export function SourcecodeListMain() {
  const resetPage = useResetAtom(sourcecodePageAtom);
  const setSearchText = useSetAtom(sourcecodeSearchTextAtom);
  const setSearchKeyword = useSetAtom(sourcecodeSearchKeywordAtom);
  const resetCheckedList = useResetAtom(sourcecodeCheckedListAtom);
  const setSort = useSetAtom(sourcecodeSortAtom);
  const resetCodeType = useResetAtom(sourcecodeTypeSortAtom);
  const resetHasMine = useResetAtom(sourcecodeHasMineAtom);

  useEffect(() => {
    resetPage();
    setSearchText("");
    setSearchKeyword("");
    resetCheckedList();
    setSort(SOURCECODE_DEFAULT_SORT);
    resetCodeType();
    resetHasMine();
  }, [
    resetPage,
    setSearchText,
    setSearchKeyword,
    resetCheckedList,
    setSort,
    resetCodeType,
    resetHasMine,
  ]);

  return (
    <AsideDetailContainer>
      <EmptyState title="소스코드를 선택해 주세요." />
    </AsideDetailContainer>
  );
}
