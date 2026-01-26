"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import {
  volumeCheckedListAtom,
  volumeHasMineAtom,
  volumeOrderSortAtom,
  volumePageAtom,
  volumeSearchKeywordAtom,
  volumeSearchTextAtom,
  volumeTypeSortAtom,
} from "@/domain/volume/state/volume.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

export function VolumeListMain() {
  const resetPage = useResetAtom(volumePageAtom);
  const setSearchText = useSetAtom(volumeSearchTextAtom);
  const setSearchKeyword = useSetAtom(volumeSearchKeywordAtom);
  const resetCheckedList = useResetAtom(volumeCheckedListAtom);
  const resetSort = useResetAtom(volumeOrderSortAtom);
  const resetVolumeType = useResetAtom(volumeTypeSortAtom);
  const resetHasMine = useResetAtom(volumeHasMineAtom);

  useEffect(() => {
    resetPage();
    setSearchText("");
    setSearchKeyword("");
    resetCheckedList();
    resetSort();
    resetVolumeType();
    resetHasMine();
  }, [
    resetPage,
    setSearchText,
    setSearchKeyword,
    resetCheckedList,
    resetSort,
    resetVolumeType,
    resetHasMine,
  ]);

  return (
    <AsideDetailContainer>
      <EmptyState title="볼륨을 선택해 주세요." />
    </AsideDetailContainer>
  );
}
