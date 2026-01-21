"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { CreateRegistryTagModal } from "@/domain/registry/components/create-registry-tag-modal";
import { DeleteRegistryModal } from "@/domain/registry/components/delete-registry-modal";
import { DeleteRegistryTagModal } from "@/domain/registry/components/delete-registry-tag-modal";
import { RegistryDetailAside } from "@/domain/registry/components/detail/registry-detail-aside";
import { RegistryDetailBody } from "@/domain/registry/components/detail/registry-detail-body";
import { ScanRegistryTagModal } from "@/domain/registry/components/scan-registry-tag-modal";
import { ViewRegistryTagDetailModal } from "@/domain/registry/components/view-registry-tag-detail-modal";
import {
  REGISTRY_TAG_PAGE_SIZE,
  REGISTRY_TAG_SORT_FIELD_MAP,
} from "@/domain/registry/constants/registry-detail.constant";
import { useGetRegistryTagListByMode } from "@/domain/registry/hooks/use-get-registry-tag-list-by-mode";
import {
  registryTagCheckedListAtom,
  registryTagPageAtom,
  registryTagSearchTextAtom,
  registryTagSelectedAtom,
  registryTagSortAtom,
} from "@/domain/registry/state/registry-detail.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

interface RegistryDetailMainProps {
  mode: RegistryMode;
}

/**
 * 레지스트리 이미지 상세 페이지 메인 컴포넌트
 *
 * AdminInternalRegistryImageDetailMain의 UI 구조와
 * RegistryDetailMain의 기능을 통합한 컴포넌트
 */
export function RegistryDetailMain({ mode }: RegistryDetailMainProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const resetPage = useResetAtom(registryTagPageAtom);
  const resetSearchText = useResetAtom(registryTagSearchTextAtom);
  const resetSort = useResetAtom(registryTagSortAtom);
  const resetCheckedList = useResetAtom(registryTagCheckedListAtom);

  const page = useAtomValue(registryTagPageAtom);
  const searchText = useAtomValue(registryTagSearchTextAtom);
  const sort = useAtomValue(registryTagSortAtom);
  const setSelectedTag = useSetAtom(registryTagSelectedAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REGISTRY_TAG_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetRegistryTagListByMode(mode, {
    pageNo: page - 1,
    pageSize: REGISTRY_TAG_PAGE_SIZE,
    keyword: searchText,
    harborImageName,
    ...(sortRequest
      ? { sort: sortRequest.sort, order: sortRequest.order }
      : {}),
  });

  // 첫 번째 태그 자동 선택 (최초 1회만)
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isInitializedRef.current && data?.content && data.content.length > 0) {
      setSelectedTag(data.content[0]);
      isInitializedRef.current = true;
    }
  }, [data?.content, setSelectedTag]);

  useEffect(() => {
    resetPage();
    resetSearchText();
    resetSort();
    resetCheckedList();
  }, [resetPage, resetSearchText, resetSort, resetCheckedList]);

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey={`user.${mode}-registry.detail`} />

      {/* 레지스트리 이미지 상세 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (Body) */}
        <RegistryDetailBody
          mode={mode}
          data={data?.content || []}
          totalSize={data?.totalSize || 0}
          isLoading={isLoading}
          isError={isError}
        />
        {/* 목록 페이지 - 오른쪽 영역 (Aside) */}
        <ListPageAside $width={ASIDE_WIDTH}>
          <RegistryDetailAside mode={mode} />
        </ListPageAside>
      </ListPageMain>

      {/* 레지스트리 이미지 삭제 모달 */}
      <DeleteRegistryModal mode={mode} />
      {/* 레지스트리 이미지 태그 생성 모달 */}
      <CreateRegistryTagModal mode={mode} />
      {/* 레지스트리 이미지 태그 삭제 모달 */}
      <DeleteRegistryTagModal mode={mode} />
      {/* 레지스트리 이미지 태그 스캔 확인 모달 */}
      <ScanRegistryTagModal mode={mode} />
      {/* 레지스트리 이미지 태그 상세 모달 */}
      <ViewRegistryTagDetailModal mode={mode} />
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
    </>
  );
}
