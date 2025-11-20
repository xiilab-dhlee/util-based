"use client";

import { Icon } from "xiilab-ui";

import { CreateAstragoVolumeModal } from "@/domain/volume/components/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/domain/volume/components/create-onprem-volume-modal";
import { SelectVolumeTypeModal } from "@/domain/volume/components/select-volume-type-modal";
import { WorkloadListBody } from "@/domain/workload/components/list/workload-list-body";
import { WorkloadListFilter } from "@/domain/workload/components/list/workload-list-filter";
import { WorkloadListFooter } from "@/domain/workload/components/list/workload-list-footer";
import { PageGuide } from "@/shared/layouts/common/page-guide";
import { PageHeader } from "@/shared/layouts/common/page-header";
import { PageImageGuide } from "@/shared/layouts/common/page-image-guide";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

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

export function WorkloadListMain() {
  const handleCreateWorkload = () => {};

  return (
    <>
      <PageHeader
        pageKey="user.workload"
        description="Workload"
      />

      {/* 워크로드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 워크로드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="Create Workload"
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

        {/* 워크로드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 워크로드 목록 필터 */}
          <WorkloadListFilter />
          {/* 워크로드 목록 본문 */}
          <WorkloadListBody />
          {/* 워크로드 목록 페이지네이션 */}
          <WorkloadListFooter />
        </ListPageBody>
      </ListPageMain>

      {/* 볼륨 생성 관련 모달들 - drawer보다 상단에 표시 */}
      <SelectVolumeTypeModal />
      <CreateAstragoVolumeModal />
      <CreateOnPremVolumeModal />
    </>
  );
}
