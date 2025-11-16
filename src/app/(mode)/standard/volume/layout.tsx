import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { ViewVulnerabilityModal } from "@/components/common/modal/view-vulnerability-modal";
import { CompressVolumeFileModal } from "@/components/volume/compress-volume-file-modal";
import { CreateAstragoVolumeModal } from "@/components/volume/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/components/volume/create-onprem-volume-modal";
import { CreateVolumeFolderModal } from "@/components/volume/create-volume-folder-modal";
import { DeleteVolumeModal } from "@/components/volume/delete-volume-modal";
import { VolumeListBody } from "@/components/volume/list/volume-list-body";
import { VolumeListFilter } from "@/components/volume/list/volume-list-filter";
import { VolumeListFooter } from "@/components/volume/list/volume-list-footer";
import { SelectVolumeTypeModal } from "@/components/volume/select-volume-type-modal";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard/dashboard",
  },
  { title: "볼륨" },
];

export const metadata: Metadata = {
  title: "Volume",
};
export default function VolumeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader title="볼륨" icon="Volume" description="Volume">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 볼륨 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 볼륨 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 볼륨 목록 필터 */}
          <VolumeListFilter />
          {/* 볼륨 목록 본문 */}
          <VolumeListBody />
          {/* 볼륨 목록 페이지네이션 */}
          <VolumeListFooter />
        </ListPageBody>
        {children}
      </ListPageMain>
      {/* 소스코드 삭제 모달 */}
      <DeleteVolumeModal />
      {/* 볼륨 생성 모달 */}
      <SelectVolumeTypeModal />
      <CreateAstragoVolumeModal />
      <CreateOnPremVolumeModal />
      {/* 취약점 조회 모달 */}
      <ViewVulnerabilityModal />
      {/* 볼륨 파일 압축 모달 */}
      <CompressVolumeFileModal />
      {/* 볼륨 폴더 추가 모달 */}
      <CreateVolumeFolderModal />
    </>
  );
}
