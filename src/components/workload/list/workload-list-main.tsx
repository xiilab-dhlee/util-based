"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { CreateAstragoVolumeModal } from "@/components/volume/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/components/volume/create-onprem-volume-modal";
import { SelectVolumeTypeModal } from "@/components/volume/select-volume-type-modal";
import { WorkloadListBody } from "@/components/workload/list/workload-list-body";
import { WorkloadListFilter } from "@/components/workload/list/workload-list-filter";
import { WorkloadListFooter } from "@/components/workload/list/workload-list-footer";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import { Workload } from "@/models/workload.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard",
  },
  { title: "워크로드", href: "/standard/workload" },
];

export function WorkloadListMain() {
  const handleCreateWorkload = () => {};

  return (
    <>
      <PageHeader
        title={Workload.TITLE}
        icon="Workload"
        description={Workload.TITLE_ENG}
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 워크로드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 워크로드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng={Workload.GUIDE_TITLE_ENG}
            title={Workload.GUIDE_TITLE}
            icon="Plus"
            description={Workload.GUIDE_DESCRIPTION}
            backgroundImageName={Workload.GUIDE_BG_IMAGE}
            guides={Workload.GUIDES}
            buttonOptions={{
              enabled: true,
              text: "워크로드 생성하기",
              onClick: handleCreateWorkload,
            }}
          />

          {/* 워크로드 가이드 이미지 카드 */}
          <PageImageGuide
            title="워크로드 가이드"
            guideImages={Workload.GUIDE_IMAGES}
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
