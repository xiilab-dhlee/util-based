"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import { Icon } from "xiilab-ui";

import { useGetUsageRequestList } from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request";
import { ApproveRequestImageModal } from "@/domain/request-image/components/approve-request-image-modal";
import { RejectRequestImageModal } from "@/domain/request-image/components/reject-request-image-modal";
import { RequestImageListBody } from "@/domain/request-image/components/request-image-list-body";
import { RequestImageListFilter } from "@/domain/request-image/components/request-image-list-filter";
import { RequestImageListFooter } from "@/domain/request-image/components/request-image-list-footer";
import { ViewAndEditDecisionReasonModal } from "@/domain/request-image/components/view-and-edit-decision-reason-modal";
import { REQUEST_IMAGE_SORT_FIELD_MAP } from "@/domain/request-image/constants/request-image.constant";
import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
  requestImageSortAtom,
  requestImageStatusAtom,
  requestImageWorkspaceIdAtom,
} from "@/domain/request-image/state/request-image.atom";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/request-image-guide1.png",
    alt: "이미지 요청 가이드 1",
  },
  {
    id: "2",
    src: "/images/request-image-guide2.png",
    alt: "이미지 요청 가이드 2",
  },
  {
    id: "3",
    src: "/images/request-image-guide3.png",
    alt: "이미지 요청 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="PrivateRegistry" color="var(--icon-fill)" />,
    title: "개인 레지스트리란?",
    description: [
      "개인이 사용하는 컨테이너 이미지를 저장하고 관리하는",
      "전용 저장소입니다. 인터넷 연결 없이 사용하실 수 있습니다.",
    ],
  },
  {
    icon: <Icon name="Image" color="var(--icon-fill)" />,
    title: "이미지 사용 요청 목록이란?",
    description: [
      "사용할 이미지의 요청 목록을 보는 목록으로 이미지 사용 요청의",
      "승인, 반려와 승인 상태에 대해서 한눈에 확인할 수 있는 화면입니다.",
    ],
  },
];

/**
 * 이미지 요청 목록 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 이미지 요청 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 이미지 요청 생성 가이드, 필터링, 목록 표시, 페이지네이션 등의 기능을 포함합니다.
 * Main 컴포넌트에서 API를 호출하고 각 하위 컴포넌트에 props로 데이터를 전달합니다.
 *
 * @returns 이미지 요청 목록 페이지 JSX
 */
export function RequestImageListMain() {
  // 상태 초기화를 위한 reset 함수들
  const resetPage = useResetAtom(requestImagePageAtom);
  const resetSearchText = useResetAtom(requestImageSearchTextAtom);
  const resetSort = useResetAtom(requestImageSortAtom);
  const resetStatus = useResetAtom(requestImageStatusAtom);
  const resetWorkspaceId = useResetAtom(requestImageWorkspaceIdAtom);

  // 상태 값 조회
  const page = useAtomValue(requestImagePageAtom);
  const searchText = useAtomValue(requestImageSearchTextAtom);
  const sort = useAtomValue(requestImageSortAtom);
  const approvalStatus = useAtomValue(requestImageStatusAtom);
  const workspaceId = useAtomValue(requestImageWorkspaceIdAtom);

  const sortRequest = buildSortRequest({
    state: sort,
    fieldMap: REQUEST_IMAGE_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetUsageRequestList({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    sort: sortRequest?.sort ?? "REQUESTED_AT",
    order: sortRequest?.order ?? "DESC",
    approvalStatus: approvalStatus ?? undefined,
    workspaceId: workspaceId || undefined,
  });

  // 컴포넌트 마운트 시 상태 초기화
  useEffect(() => {
    resetPage();
    resetSearchText();
    resetSort();
    resetStatus();
    resetWorkspaceId();
  }, [resetPage, resetSearchText, resetSort, resetStatus, resetWorkspaceId]);

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        pageKey="admin.request-image"
        description="About Manage Image usage request"
      />

      {/* 이미지 요청 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 이미지 요청 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            title="이미지 사용 요청 관리"
            icon="Image"
            description={[
              "관리자는 사용자가 요청한 이미지 사용 요청 목록과 요청 사유를",
              "확인하여, 해당 요청을 승인하거나 반려할 수 있는 화면입니다.",
            ]}
            backgroundImageName="request-image-intro-background.png"
            guides={GUIDES}
          />

          {/* 이미지 요청 가이드 이미지 카드 */}
          <PageImageGuide
            title="이미지 사용 요청 목록 가이드"
            guideImages={GUIDE_IMAGES}
          />
        </ListPageAside>

        {/* 이미지 요청 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 이미지 요청 목록 필터 */}
          <RequestImageListFilter
            total={data?.totalSize || 0}
            loading={isLoading}
          />
          {/* 이미지 요청 목록 본문 */}
          <RequestImageListBody
            content={data?.content || []}
            loading={isLoading}
            isError={isError}
          />
          {/* 이미지 요청 목록 페이지네이션 */}
          <RequestImageListFooter
            total={data?.totalSize || 0}
            loading={isLoading}
          />
        </ListPageBody>
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 이미지 요청 승인 모달 */}
      <ApproveRequestImageModal />
      {/* 이미지 요청 반려 모달 */}
      <RejectRequestImageModal />
      {/* 승인/반려 사유 보기 및 수정 통합 모달 */}
      <ViewAndEditDecisionReasonModal />
    </>
  );
}
