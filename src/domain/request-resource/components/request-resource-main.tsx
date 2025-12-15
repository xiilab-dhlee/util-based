"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { ApproveResourceModal } from "@/domain/request-resource/components/approve-request-resource-modal";
import { RejectResourceModal } from "@/domain/request-resource/components/reject-request-resource-modal";
import { RequestResourceBody } from "@/domain/request-resource/components/request-resource-body";
import { RequestResourceFilter } from "@/domain/request-resource/components/request-resource-filter";
import { RequestResourceFooter } from "@/domain/request-resource/components/request-resource-footer";
import { RequestResourceIntroCard } from "@/domain/request-resource/components/request-resource-intro-card";
import { ResourcePageAside } from "@/domain/request-resource/components/resource-page-aside";
import { useGetRequestResources } from "@/domain/request-resource/hooks/use-get-request-resources";
import {
  requestResourceKeywordAtom,
  requestResourcePageAtom,
  requestResourceStatusAtom,
} from "@/domain/request-resource/state/request-resource.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { ALL_OPTION, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export function RequestResourceMain() {
  const [page, setPage] = useAtom(requestResourcePageAtom);
  const status = useAtomValue(requestResourceStatusAtom);
  const keyword = useAtomValue(requestResourceKeywordAtom);

  // 초기화 함수
  const resetPage = useResetAtom(requestResourcePageAtom);
  const resetStatus = useResetAtom(requestResourceStatusAtom);
  const resetKeyword = useResetAtom(requestResourceKeywordAtom);

  // 페이지 이탈 시 초기화
  useEffect(() => {
    return () => {
      resetPage();
      resetStatus();
      resetKeyword();
    };
  }, [resetPage, resetStatus, resetKeyword]);

  // 필터(status, keyword) 변경 시 페이지 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: status, keyword 변경 감지 목적
  useEffect(() => {
    setPage(1);
  }, [status, keyword, setPage]);

  // API용 status 변환 (null 또는 ALL일 때는 undefined)
  const apiStatus =
    status === null || status === ALL_OPTION.value ? undefined : status;

  // 리소스 요청 목록 조회
  const { data, isLoading, isError } = useGetRequestResources({
    page,
    size: LIST_PAGE_SIZE,
    status: apiStatus,
    keyword: keyword || undefined,
  });

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
