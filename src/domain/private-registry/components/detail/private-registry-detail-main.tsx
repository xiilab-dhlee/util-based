"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useGetPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import { CreatePrivateRegistryTagModal } from "@/domain/private-registry/components/create-private-registry-tag-modal";
import { DeletePrivateRegistryModal } from "@/domain/private-registry/components/delete-private-registry-modal";
import { DeletePrivateRegistryTagModal } from "@/domain/private-registry/components/delete-private-registry-tag-modal";
import { PrivateRegistryDetailAside } from "@/domain/private-registry/components/detail/private-registry-detail-aside";
import { PrivateRegistryTagListBody } from "@/domain/private-registry/components/detail/private-registry-tag-list-body";
import { PrivateRegistryTagListFilter } from "@/domain/private-registry/components/detail/private-registry-tag-list-filter";
import { PrivateRegistryTagListFooter } from "@/domain/private-registry/components/detail/private-registry-tag-list-footer";
import { PRIVATE_REGISTRY_TAG_SORT_FIELD_MAP } from "@/domain/private-registry/constants/private-registry.constant";
import {
  privateregistryImageTagCheckedListAtom,
  privateregistryImageTagPageAtom,
  privateregistryImageTagSearchTextAtom,
  privateregistryImageTagSortAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 프라이빗 레지스트리 이미지 상세 페이지 메인 컴포넌트
 */
export function PrivateRegistryDetailMain() {
  const { id } = useParams();

  const resetPage = useResetAtom(privateregistryImageTagPageAtom);
  const setSearchText = useSetAtom(privateregistryImageTagSearchTextAtom);
  const setSort = useSetAtom(privateregistryImageTagSortAtom);
  const resetCheckedList = useResetAtom(privateregistryImageTagCheckedListAtom);

  const page = useAtomValue(privateregistryImageTagPageAtom);
  const searchText = useAtomValue(privateregistryImageTagSearchTextAtom);
  const sort = useAtomValue(privateregistryImageTagSortAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: PRIVATE_REGISTRY_TAG_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetPrivateImageTagList({
    pageNo: page - 1,
    pageSize: 20,
    keyword: searchText,
    harborImageName: decodeURIComponent(id as string),
    ...(sortRequest
      ? { sort: sortRequest.sort, order: sortRequest.order }
      : {}),
  });

  useEffect(() => {
    resetPage();
    setSearchText("");
    setSort({ field: "createdAt", order: "descend" });
    resetCheckedList();
  }, [resetPage, setSearchText, setSort, resetCheckedList]);

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey="user.private-registry.detail" />

      {/* 프라이빗 레지스트리 이미지 상세 페이지 메인 영역 */}
      <DetailPageBody>
        <PrivateRegistryDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <PrivateRegistryTagListFilter
              totalSize={data?.totalSize}
              loading={isLoading}
            />
            <PrivateRegistryTagListBody
              data={data?.content || []}
              isLoading={isLoading}
              isError={isError}
            />
            <PrivateRegistryTagListFooter
              totalSize={data?.totalSize || 0}
              isLoading={isLoading}
            />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 프라이빗 레지스트리 이미지 삭제 모달 */}
      <DeletePrivateRegistryModal />
      {/* 프라이빗 레지스트리 이미지 태그 생성 모달 */}
      <CreatePrivateRegistryTagModal />
      {/* 프라이빗 레지스트리 이미지 태그 삭제 모달 */}
      <DeletePrivateRegistryTagModal />
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
    </>
  );
}
