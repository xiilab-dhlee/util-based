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

/**
 * Hub 목록 페이지의 Aside 컨텐츠
 *
 * 데이터 로드 후 첫 번째 허브로 자동 리다이렉트합니다.
 * /user/hub 페이지에서 children으로 렌더링됩니다.
 *
 * 동작 흐름:
 * 1. 허브 목록 데이터 조회
 * 2. 데이터 로드 완료 시 첫 번째 허브 상세 페이지로 리다이렉트
 * 3. 리다이렉트 전까지 첫 번째 허브 정보 표시
 */
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
