"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import {
  hubPageAtom,
  hubSearchKeywordAtom,
  hubSearchTextAtom,
} from "@/domain/hub/state/hub.atom";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

export function HubListMain() {
  const resetPage = useResetAtom(hubPageAtom);
  const setSearchText = useSetAtom(hubSearchTextAtom);
  const setSearchKeyword = useSetAtom(hubSearchKeywordAtom);

  // 페이지 최초 진입 시 페이지 번호와 검색어 초기화
  useEffect(() => {
    resetPage();
    setSearchText("");
    setSearchKeyword("");
  }, [resetPage, setSearchText, setSearchKeyword]);

  return (
    <AsideDetailContainer>
      <ListEmpty
        title="허브가 선택되지 않았습니다."
        message="먼저 허브를 선택해 주세요."
      />
    </AsideDetailContainer>
  );
}
