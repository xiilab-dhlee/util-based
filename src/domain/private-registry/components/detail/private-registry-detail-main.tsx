"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useGetPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import { CreatePrivateRegistryTagModal } from "@/domain/private-registry/components/create-private-registry-tag-modal";
import { DeletePrivateRegistryModal } from "@/domain/private-registry/components/delete-private-registry-modal";
import { DeletePrivateRegistryTagModal } from "@/domain/private-registry/components/delete-private-registry-tag-modal";
import { PrivateRegistryDetailAside } from "@/domain/private-registry/components/detail/private-registry-detail-aside";
import { PrivateRegistryDetailBody } from "@/domain/private-registry/components/detail/private-registry-detail-body";
import { ViewPrivateRegistryTagDetailModal } from "@/domain/private-registry/components/view-private-registry-tag-detail-modal";
import { PRIVATE_REGISTRY_TAG_SORT_FIELD_MAP } from "@/domain/private-registry/constants/private-registry-tag.constant";
import {
  privateRegistryTagCheckedListAtom,
  privateRegistryTagPageAtom,
  privateRegistryTagSearchTextAtom,
  privateRegistryTagSortAtom,
} from "@/domain/private-registry/state/private-registry-tag.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 프라이빗 레지스트리 이미지 상세 페이지 메인 컴포넌트
 *
 * AdminInternalRegistryImageDetailMain의 UI 구조와
 * PrivateRegistryDetailMain의 기능을 통합한 컴포넌트
 */
export function PrivateRegistryDetailMain() {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const resetPage = useResetAtom(privateRegistryTagPageAtom);
  const resetSearchText = useResetAtom(privateRegistryTagSearchTextAtom);
  const resetSort = useResetAtom(privateRegistryTagSortAtom);
  const resetCheckedList = useResetAtom(privateRegistryTagCheckedListAtom);

  const page = useAtomValue(privateRegistryTagPageAtom);
  const searchText = useAtomValue(privateRegistryTagSearchTextAtom);
  const sort = useAtomValue(privateRegistryTagSortAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: PRIVATE_REGISTRY_TAG_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetPrivateImageTagList({
    pageNo: page - 1,
    pageSize: 10,
    keyword: searchText,
    harborImageName,
    ...(sortRequest
      ? { sort: sortRequest.sort, order: sortRequest.order }
      : {}),
  });

  useEffect(() => {
    resetPage();
    resetSearchText();
    resetSort();
    resetCheckedList();
  }, [resetPage, resetSearchText, resetSort, resetCheckedList]);

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey="user.private-registry.detail" />

      {/* 프라이빗 레지스트리 이미지 상세 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (Body) */}
        <PrivateRegistryDetailBody
          data={data?.content || []}
          totalSize={data?.totalSize || 0}
          isLoading={isLoading}
          isError={isError}
        />
        {/* 목록 페이지 - 오른쪽 영역 (Aside) */}
        <ListPageAside $width={ASIDE_WIDTH}>
          <PrivateRegistryDetailAside />
        </ListPageAside>
      </ListPageMain>

      {/* 프라이빗 레지스트리 이미지 삭제 모달 */}
      <DeletePrivateRegistryModal />
      {/* 프라이빗 레지스트리 이미지 태그 생성 모달 */}
      <CreatePrivateRegistryTagModal />
      {/* 프라이빗 레지스트리 이미지 태그 삭제 모달 */}
      <DeletePrivateRegistryTagModal />
      {/* 프라이빗 레지스트리 이미지 태그 상세 모달 */}
      <ViewPrivateRegistryTagDetailModal />
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
    </>
  );
}
