"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import type { TabsSeparatedItem } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { CreateGroupModal } from "@/domain/group/components/create-group-modal";
import { openCreateGroupModalAtom } from "@/domain/group/state/group.atom";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { RouteTab } from "@/shared/components/tab";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
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
    alt: "사용자 가이드 1",
  },
  {
    id: "2",
    src: "/images/user-guide2.png",
    alt: "사용자 가이드 2",
  },
  {
    id: "3",
    src: "/images/user-guide3.png",
    alt: "사용자 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="SystemFilled" color="var(--icon-fill)" />,
    title: "그룹 관리란?",
    description: [
      "초기 가입 시 사용자가 선택한 그룹이 기본값으로 설정됩니다.",
      "관리자는 사용자 그룹 설정을 변경하여 사용자를 관리할 수 있습니다.",
    ],
  },
  {
    icon: <Icon name="Delete" color="var(--icon-fill)" />,
    title: "그룹 삭제란?",
    description: [
      "관리자는 생성된 그룹을 생성, 수정, 삭제하여 관리할 수 있습니다.",
      "그룹 삭제시 포함된 사용자들은 '그룹 미지정 계정'으로 이동됩니다.",
    ],
  },
];

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "사용자 목록",
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
 * 사용자 목록 페이지 레이아웃
 *
 * 이 레이아웃은 user 하위의 모든 페이지에 적용됩니다.
 */
export default function AdminUserLayout({ children }: PropsWithChildren) {
  const { onOpen } = useGlobalModal(openCreateGroupModalAtom);

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        title="계정 관리"
        icon="Person"
        description="Manage Account"
        breadcrumbKey="admin.user"
      />

      {/* 사용자 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 사용자 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="About Manage Accounts"
            title="그룹 관리"
            icon="Group01"
            description={[
              "그룹을 생성하거나 삭제할 수 있으며, 그룹에 속한 사용자를",
              "추가하거나 제거하여 효율적으로 사용자 관리를 할 수 있습니다.",
            ]}
            backgroundImageName="user-intro-background.png"
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "그룹 추가",
              onClick: () => onOpen(),
            }}
          />

          {/* 사용자 가이드 이미지 카드 */}
          <PageImageGuide title="계정 관리 가이드" guideImages={GUIDE_IMAGES} />
        </ListPageAside>

        {/* 사용자 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <StyledListPageBody>
          <RouteTab items={TAB_ITEMS} />
          {children}
        </StyledListPageBody>
      </ListPageMain>
      {/* 그룹 생성 모달 */}
      <CreateGroupModal />
      {/* 멤버 추가 모달 */}
      {/* <MemberAddModal /> */}
    </>
  );
}

const StyledListPageBody = styled(ListPageBody)`
  padding: 0;
`;
