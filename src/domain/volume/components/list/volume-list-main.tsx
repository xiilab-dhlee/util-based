"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import {
  volumePageAtom,
  volumeSearchTextAtom,
} from "@/domain/volume/state/volume.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

export function VolumeListMain() {
  const resetPage = useResetAtom(volumePageAtom);
  const setSearchText = useSetAtom(volumeSearchTextAtom);

  // 페이지 최초 진입 시 페이지 번호와 검색어 초기화
  useEffect(() => {
    resetPage();
    setSearchText("");
  }, [resetPage, setSearchText]);

  return (
    <AsideDetailContainer>
      <EmptyState title="볼륨을 선택해 주세요." />
    </AsideDetailContainer>
  );
}
