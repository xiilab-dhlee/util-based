import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { CompressVolumeFileModal } from "@/domain/volume/components/compress-volume-file-modal";
import { CreateAstragoVolumeModal } from "@/domain/volume/components/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/domain/volume/components/create-onprem-volume-modal";
import { CreateVolumeFolderModal } from "@/domain/volume/components/create-volume-folder-modal";
import { DeleteVolumeModal } from "@/domain/volume/components/delete-volume-modal";
import { VolumeListBody } from "@/domain/volume/components/list/volume-list-body";
import { VolumeListFilter } from "@/domain/volume/components/list/volume-list-filter";
import { VolumeListFooter } from "@/domain/volume/components/list/volume-list-footer";
import { SelectVolumeTypeModal } from "@/domain/volume/components/select-volume-type-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewVulnerabilityModal } from "@/shared/components/modal/view-vulnerability-modal";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export const metadata: Metadata = {
  title: "Volume",
};
export default function VolumeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader
        title="볼륨"
        icon="Volume"
        description="Volume"
        breadcrumbKey="standard.volume"
      />
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
