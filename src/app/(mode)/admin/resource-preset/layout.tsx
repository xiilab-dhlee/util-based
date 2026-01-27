"use client";

import { useResetAtom } from "jotai/utils";
import { type PropsWithChildren, useEffect } from "react";

import { CreateResourcePresetDrawer } from "@/domain/resource-preset/components/create/create-resource-preset-drawer";
import { DeleteResourcePresetModal } from "@/domain/resource-preset/components/delete-resource-preset-modal";
import { ResourcePresetListMain } from "@/domain/resource-preset/components/list/resource-preset-list-main";
import {
  resourcePresetCheckedListAtom,
  resourcePresetJobTypeAtom,
  resourcePresetNodeTypeAtom,
  resourcePresetPageAtom,
  resourcePresetSearchTextAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 리소스 프리셋 관리 목록 페이지 레이아웃
 */
export default function AdminResourcePresetLayout({
  children,
}: PropsWithChildren) {
  // 리셋 함수
  const resetPage = useResetAtom(resourcePresetPageAtom);
  const resetSearch = useResetAtom(resourcePresetSearchTextAtom);
  const resetJobType = useResetAtom(resourcePresetJobTypeAtom);
  const resetNodeType = useResetAtom(resourcePresetNodeTypeAtom);
  const resetCheckedList = useResetAtom(resourcePresetCheckedListAtom);

  // 페이지 이탈 시 필터 상태 초기화
  useEffect(() => {
    return () => {
      resetPage();
      resetSearch();
      resetJobType();
      resetNodeType();
      resetCheckedList();
    };
  }, [resetPage, resetSearch, resetJobType, resetNodeType, resetCheckedList]);

  return (
    <>
      <PageHeader
        pageKey="admin.resource-preset"
        description="Resource Preset Management"
      />
      {/* 리소스 프리셋 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 리소스 프리셋 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          <ResourcePresetListMain />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
      {/* 리소스 프리셋 생성 드로어 */}
      <CreateResourcePresetDrawer />
      {/* 리소스 프리셋 삭제 모달 */}
      <DeleteResourcePresetModal />
    </>
  );
}
