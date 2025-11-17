"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import type { TabsSeparatedItem } from "xiilab-ui";

import { openCreateGroupModalAtom } from "@/atoms/group/group.atom";
import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { RouteTab } from "@/components/common/tab";
import { CreateGroupModal } from "@/components/group/create-group-modal";
// import { MemberAddModal } from "@/components/setting/modal/member-add-modal";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { USER_GUIDE_IMAGES, USER_GUIDES } from "@/constants/user/user.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM,
  { title: "계정 관리" },
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
      <PageHeader title="계정 관리" icon="Person" description="Manage Account">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

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
            guides={USER_GUIDES}
            buttonOptions={{
              enabled: true,
              text: "그룹 추가",
              onClick: () => onOpen(),
            }}
          />

          {/* 사용자 가이드 이미지 카드 */}
          <PageImageGuide
            title="계정 관리 가이드"
            guideImages={USER_GUIDE_IMAGES}
          />
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
