"use client";

import { Icon } from "xiilab-ui";

import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { ApproveRequestImageModal } from "./approve-request-image-modal";
import { RejectRequestImageModal } from "./reject-request-image-modal";
import { RequestImageListBody } from "./request-image-list-body";
import { RequestImageListFilter } from "./request-image-list-filter";
import { RequestImageListFooter } from "./request-image-list-footer";

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
    icon: <Icon name="Image" color="var(--icon-fill)" />,
    title: "내부 레지스트리란?",
    description: [
      "조직 내부에서 사용하는 컨테이너 이미지를 저장하고 관리하는",
      "전용 저장소입니다. 인터넷 연결 없이 사용하실 수 있습니다.",
    ],
  },
  {
    icon: <Icon name="Image" color="var(--icon-fill)" />,
    title: "이미지 사용 요청 목록이란?",
    description: [
      "사용할 이미지의 요청 목록을 보는 목록으로 이미지 사용 요청의",
      "승인, 반려와 승인 여부에 대해서 한눈에 확인할 수 있는 화면입니다.",
    ],
  },
];

/**
 * 이미지 요청 목록 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 이미지 요청 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 이미지 요청 생성 가이드, 필터링, 목록 표시, 페이지네이션 등의 기능을 포함합니다.
 * 서버에서 전달받은 초기 데이터를 클라이언트 컴포넌트에 전달합니다.
 *
 * @returns 이미지 요청 목록 페이지 JSX
 */
export function RequestImageListMain() {
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
            titleEng="About Manage Image usage request"
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
          <RequestImageListFilter />
          {/* 이미지 요청 목록 본문 */}
          <RequestImageListBody />
          {/* 이미지 요청 목록 페이지네이션 */}
          <RequestImageListFooter />
        </ListPageBody>
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 이미지 요청 승인 모달 */}
      <ApproveRequestImageModal />
      {/* 이미지 요청 반려 모달 */}
      <RejectRequestImageModal />
    </>
  );
}
