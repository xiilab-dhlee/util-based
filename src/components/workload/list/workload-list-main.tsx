"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { CreateAstragoVolumeModal } from "@/components/volume/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/components/volume/create-onprem-volume-modal";
import { SelectVolumeTypeModal } from "@/components/volume/select-volume-type-modal";
import { WorkloadListBody } from "@/components/workload/list/workload-list-body";
import { WorkloadListFilter } from "@/components/workload/list/workload-list-filter";
import { WorkloadListFooter } from "@/components/workload/list/workload-list-footer";
import { STANDARD_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import {
  WORKLOAD_GUIDE_IMAGES,
  WORKLOAD_GUIDES,
} from "@/constants/workload/workload.constant";
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
  STANDARD_ROOT_BREADCRUMB_ITEM,
  { title: "워크로드" },
];

export function WorkloadListMain() {
  const handleCreateWorkload = () => {};

  return (
    <>
      <PageHeader title="워크로드" icon="Workload" description="Workload">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

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
            guides={WORKLOAD_GUIDES}
            buttonOptions={{
              enabled: true,
              text: "워크로드 생성하기",
              onClick: handleCreateWorkload,
            }}
          />

          {/* 워크로드 가이드 이미지 카드 */}
          <PageImageGuide
            title="워크로드 가이드"
            guideImages={WORKLOAD_GUIDE_IMAGES}
          />
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
