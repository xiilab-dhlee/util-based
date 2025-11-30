"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import type { TabsSeparatedItem } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { ManageGroupModal } from "@/domain/group/components/manage-group-modal";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { RouteTab } from "@/shared/components/tab";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/user-guide1.png",
    alt: "계정 가이드 1",
  },
  {
    id: "2",
    src: "/images/user-guide2.png",
    alt: "계정 가이드 2",
  },
  {
    id: "3",
    src: "/images/user-guide3.png",
    alt: "계정 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="SystemFilled" color="var(--icon-fill)" />,
    title: "그룹 관리란?",
    description: [
      "초기 가입 시 계정이 선택한 그룹이 기본값으로 설정됩니다.",
      "관리자는 계정 그룹 설정을 변경하여 계정을 관리할 수 있습니다.",
    ],
  },
  {
    icon: <Icon name="Delete" color="var(--icon-fill)" />,
    title: "그룹 삭제란?",
    description: [
      "관리자는 생성된 그룹을 생성, 수정, 삭제하여 관리할 수 있습니다.",
      "그룹 삭제시 포함된 계정들을 '그룹 미지정 계정'으로 이동됩니다.",
    ],
  },
];

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "계정 목록",
    icon: "Workload",
  },
  {
    key: "pending",
    label: "가입 승인 관리",
    icon: "SignIn",
  },
  {
    key: "group",
    label: "그룹 관리",
    icon: "Group01",
  },
];

/**
 * 계정 목록 페이지 레이아웃
 *
 * 이 레이아웃은 user 하위의 모든 페이지에 적용됩니다.
 */
export default function AdminUserLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        pageKey="admin.account-management"
        description="Manage Account"
      />

      {/* 계정 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 계정 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="About Manage Accounts"
            title="계정 관리"
            icon="Group01"
            description={[
              "회원가입을 요청한 계정들을 승인하거나, 등록된 계정을",
              "관리할 수 있습니다.",
              "계정을 그룹으로 관리하세요.",
            ]}
            backgroundImageName="user-intro-background.png"
            guides={GUIDES}
          />

          {/* 계정 가이드 이미지 카드 */}
          <PageImageGuide title="계정 관리 가이드" guideImages={GUIDE_IMAGES} />
        </ListPageAside>

        {/* 계정 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <StyledListPageBody>
          <RouteTab items={TAB_ITEMS} />
          {children}
        </StyledListPageBody>
      </ListPageMain>
      {/* 그룹 생성/수정 모달 */}
      <ManageGroupModal />
      {/* 멤버 추가 모달 */}
      {/* <MemberAddModal /> */}
    </>
  );
}

const StyledListPageBody = styled(ListPageBody)`
  padding: 0;
`;
