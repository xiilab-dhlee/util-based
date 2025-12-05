"use client";

import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { RouteTab } from "@/shared/components/tab";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "활성화",
    icon: "Verification02",
  },
  {
    key: "disabled",
    label: "비활성화",
    icon: "Close",
  },
];

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/create-workload-guide1.png",
    alt: "워크로드 가이드 1",
  },
  {
    id: "2",
    src: "/images/create-workload-guide2.png",
    alt: "워크로드 가이드 2",
  },
  {
    id: "3",
    src: "/images/create-workload-guide3.png",
    alt: "워크로드 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Workload" color="var(--icon-fill)" />,
    title: "워크로드란?",
    description: [
      "워크로드란 워크스페이스에서 이뤄지는 잡(Job) 입니다.",
      "입력한 정보를 바탕으로 학습이 진행되도록 합니다.",
    ],
  },
  {
    icon: <Icon name="Workspace01" color="var(--icon-fill)" />,
    title: "워크스페이스란?",
    description: [
      "워크스페이스란 팀별로 함께 사용하는 작업공간입니다.",
      "팀원이 생성한 워크로드 및 진행상황 확인이 가능합니다.",
    ],
  },
];

export default function UserWorkloadListLayout({
  children,
}: PropsWithChildren) {
  const publish = usePublish();

  const handleCreateWorkload = () => {
    publish(WORKLOAD_EVENTS.sendCreateWorkload, null);
  };

  return (
    <>
      <PageHeader pageKey="user.workload" description="Workload" />

      {/* 워크로드 목록 페이지 메인 영역 */}
      <DetailPageBody>
        {/* 워크로드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            title="워크로드 생성"
            icon="Plus"
            description={[
              "원하는 Job Type, 이미지 및 리소스, 소스 코드 등을 입력해",
              "워크로드를 생성해보세요.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "워크로드 생성하기",
              onClick: handleCreateWorkload,
            }}
          />

          {/* 워크로드 가이드 이미지 카드 */}
          <PageImageGuide title="워크로드 가이드" guideImages={GUIDE_IMAGES} />
        </ListPageAside>

        {/* 워크로드 목록 페이지 - 오른쪽 영역 (탭, 필터, 목록, 페이지네이션) */}
        <DetailPageContent>
          {/* 상단 탭 네비게이션 */}
          <RouteTab items={TAB_ITEMS} />
          {/* 탭별 콘텐츠 영역 */}
          <DetailContentSection>{children}</DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>

      {/* 워크로드 생성 드로어 */}
      <CreateWorkloadDrawer />
    </>
  );
}
