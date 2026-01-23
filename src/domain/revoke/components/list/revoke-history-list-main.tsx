"use client";

import { useRouter } from "next/navigation";
import { Icon } from "xiilab-ui";

import { RevokeHistoryListBody } from "@/domain/revoke/components/list/revoke-history-list-body";
import { RevokeHistoryListFilter } from "@/domain/revoke/components/list/revoke-history-list-filter";
import { RevokeHistoryListFooter } from "@/domain/revoke/components/list/revoke-history-list-footer";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { ROUTES } from "@/shared/constants/routes.constant";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/resource-revoke-guide1.png",
    alt: "리소스 회수 가이드 1",
  },
  {
    id: "2",
    src: "/images/resource-revoke-guide2.png",
    alt: "리소스 회수 가이드 2",
  },
  {
    id: "3",
    src: "/images/resource-revoke-guide3.png",
    alt: "리소스 회수 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Workspace01" color="var(--icon-fill)" />,
    title: "워크스페이스란?",
    description: [
      "워크스페이스란 팀별로 함께 사용하는 작업공간입니다.",
      "팀원이 생성한 워크로드 및 진행상황 확인이 가능합니다.",
    ],
  },
  {
    icon: <Icon name="Resource" color="var(--icon-fill)" />,
    title: "리소스 회수란?",
    description: [
      "설정한 리소스 회수 기준에 따라 회수된 이력을 관리하세요.",
      "MIG, MPS는 리소스 회수 대상에서 제외됩니다.",
    ],
  },
];

/**
 * 리소스 회수 이력 목록 메인 컴포넌트
 */
export function RevokeHistoryListMain() {
  const router = useRouter();

  const handleSettingClick = () => {
    router.push(ROUTES.ADMIN_SETTING);
  };

  return (
    <>
      <PageHeader
        pageKey="admin.workspace.revoke-history"
        description="Resource Revocation"
      />

      <ListPageMain>
        <ListPageAside $width={400}>
          <PageGuide
            title="리소스 회수 이력"
            icon="Resource"
            description={[
              "설정한 리소스 회수 기준에 따라 회수된 이력을 관리하세요.",
              "MIG, MPS는 리소스 회수 대상에서 제외됩니다.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "리소스 회수 기준 설정하기",
              onClick: handleSettingClick,
            }}
          />

          <PageImageGuide
            title="리소스 회수 가이드"
            guideImages={GUIDE_IMAGES}
          />
        </ListPageAside>

        <ListPageBody>
          <RevokeHistoryListFilter />
          <RevokeHistoryListBody />
          <RevokeHistoryListFooter />
        </ListPageBody>
      </ListPageMain>
    </>
  );
}
