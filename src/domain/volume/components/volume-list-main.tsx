"use client";

import { useAtomValue } from "jotai";

import { AsideVolume } from "@/domain/volume/components/aside-volume";
import { CompressVolumeFileModal } from "@/domain/volume/components/compress-volume-file-modal";
import { CreateAstragoVolumeModal } from "@/domain/volume/components/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/domain/volume/components/create-onprem-volume-modal";
import { CreateVolumeFolderModal } from "@/domain/volume/components/create-volume-folder-modal";
import { DeleteVolumeModal } from "@/domain/volume/components/delete-volume-modal";
import { DeleteVolumeFileModal } from "@/domain/volume/components/file/delete-volume-file-modal";
import { SelectVolumeTypeModal } from "@/domain/volume/components/select-volume-type-modal";
import { VolumeListBody } from "@/domain/volume/components/volume-list-body";
import { VolumeListFilter } from "@/domain/volume/components/volume-list-filter";
import { VolumeListFooter } from "@/domain/volume/components/volume-list-footer";
import { useGetVolumes } from "@/domain/volume/hooks/use-get-volumes";
import {
  volumePageAtom,
  volumeSearchTextAtom,
} from "@/domain/volume/state/volume.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewVulnerabilityModal } from "@/shared/components/modal/view-vulnerability-modal";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 볼륨 목록 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 볼륨 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 볼륨 생성 가이드, 필터링, 목록 표시, 페이지네이션, 상세 정보 등의 기능을 포함합니다.
 *
 * @returns 볼륨 목록 페이지 JSX
 */
export function VolumeListMain() {
  // Atom 상태 읽기
  const page = useAtomValue(volumePageAtom);
  const searchText = useAtomValue(volumeSearchTextAtom);

  // API 호출 (Main에서 한 번만 호출)
  const { data, isLoading } = useGetVolumes({
    page,
    size: 9,
    searchText,
  });

  return (
    <>
      <PageHeader pageKey="user.volume" description="Volume" />
      <ListPageMain>
        <ListPageBody>
          <VolumeListFilter total={data?.totalSize || 0} loading={isLoading} />
          <VolumeListBody content={data?.content || []} loading={isLoading} />
          <VolumeListFooter total={data?.totalSize || 0} loading={isLoading} />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>
          <AsideVolume />
        </ListPageAside>
      </ListPageMain>
      {/* 볼륨 삭제 모달 */}
      <DeleteVolumeModal />
      {/* 볼륨 생성 모달 */}
      <SelectVolumeTypeModal />
      {/* AstraGo 볼륨 생성 모달 */}
      <CreateAstragoVolumeModal />
      {/* 온프레미스 볼륨 생성 모달 */}
      <CreateOnPremVolumeModal />
      {/* 취약점 조회 모달 */}
      <ViewVulnerabilityModal />
      {/* 볼륨 파일 압축 모달 */}
      <CompressVolumeFileModal />
      {/* 볼륨 폴더 추가 모달 */}
      <CreateVolumeFolderModal />
      {/* 볼륨 파일 삭제 모달 */}
      <DeleteVolumeFileModal />
    </>
  );
}
