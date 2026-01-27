"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { useGetAdminResourceRequests } from "@/api/generated/admin-workspace/admin-workspace";
import { ApproveResourceModal } from "@/domain/request-resource/components/approve-request-resource-modal";
import { RejectResourceModal } from "@/domain/request-resource/components/reject-request-resource-modal";
import { RequestResourceBody } from "@/domain/request-resource/components/request-resource-body";
import { RequestResourceFilter } from "@/domain/request-resource/components/request-resource-filter";
import { RequestResourceFooter } from "@/domain/request-resource/components/request-resource-footer";
import { RequestResourceIntroCard } from "@/domain/request-resource/components/request-resource-intro-card";
import { ResourcePageAside } from "@/domain/request-resource/components/resource-page-aside";
import {
  REQUEST_RESOURCE_SORT_DEFAULT,
  REQUEST_RESOURCE_SORT_FIELD_MAP,
} from "@/domain/request-resource/constants/request-resource.constant";
import {
  requestResourceKeywordAtom,
  requestResourcePageAtom,
  requestResourceSortAtom,
  requestResourceStatusAtom,
} from "@/domain/request-resource/state/request-resource.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export function RequestResourceMain() {
  const [page, setPage] = useAtom(requestResourcePageAtom);
  const status = useAtomValue(requestResourceStatusAtom);
  const keyword = useAtomValue(requestResourceKeywordAtom);
  const sort = useAtomValue(requestResourceSortAtom);

  // 초기화 함수
  const resetPage = useResetAtom(requestResourcePageAtom);
  const resetStatus = useResetAtom(requestResourceStatusAtom);
  const resetKeyword = useResetAtom(requestResourceKeywordAtom);
  const resetSort = useResetAtom(requestResourceSortAtom);
  // 정렬 요청 빌드
  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REQUEST_RESOURCE_SORT_FIELD_MAP,
  });

  // 리소스 요청 목록 조회 (Orval 훅)
  const { data, isLoading, isError } = useGetAdminResourceRequests({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: keyword || undefined,
    sort: sortRequest?.sort ?? REQUEST_RESOURCE_SORT_DEFAULT.sort,
    order: sortRequest?.order ?? REQUEST_RESOURCE_SORT_DEFAULT.order,
    approvalStatus: status,
  });

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 페이지 마운트 시 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기화 목적
  useEffect(() => {
    resetPage();
    resetStatus();
    resetKeyword();
    resetSort();
  }, []);

  // 필터(status, keyword) 변경 시 페이지 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: status, keyword 변경 감지 목적
  useEffect(() => {
    resetPage();
  }, [status, keyword, sort]);

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        pageKey="admin.workspace.request-resource"
        description="Resource Application"
      />

      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 워크스페이스 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <RequestResourceIntroCard />
          <ResourcePageAside />
        </ListPageAside>
        {/* 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <RequestResourceFilter total={data?.totalSize || 0} />
          {/* 목록 본문 */}
          <RequestResourceBody
            data={data?.content || []}
            isLoading={isLoading}
            isError={isError}
          />
          {/* 목록 페이지네이션 */}
          <RequestResourceFooter
            total={data?.totalSize || 0}
            page={page}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </ListPageBody>
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 리소스 승인 모달 */}
      <ApproveResourceModal />
      {/* 리소스 반려 모달 */}
      <RejectResourceModal />
    </>
  );
}
