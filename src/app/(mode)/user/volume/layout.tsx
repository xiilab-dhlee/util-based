"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { useGetVolumeList } from "@/api/generated/volume/volume";
// Volume 전용 모달
import { CompressVolumeFileModal } from "@/domain/volume/components/compress-volume-file-modal";
import { CreateAstragoVolumeModal } from "@/domain/volume/components/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/domain/volume/components/create-onprem-volume-modal";
import { CreateVolumeFolderModal } from "@/domain/volume/components/create-volume-folder-modal";
import { DeleteVolumeModal } from "@/domain/volume/components/delete-volume-modal";
import { DeleteVolumeFileModal } from "@/domain/volume/components/file/delete-volume-file-modal";
import { VolumeListBody } from "@/domain/volume/components/list/volume-list-body";
import { VolumeListFilter } from "@/domain/volume/components/list/volume-list-filter";
import { VolumeListFooter } from "@/domain/volume/components/list/volume-list-footer";
import { SelectVolumeTypeModal } from "@/domain/volume/components/select-volume-type-modal";
import { VOLUME_PAGE_SIZE } from "@/domain/volume/constants/volume.constant";
import {
  volumePageAtom,
  volumeSearchTextAtom,
} from "@/domain/volume/state/volume.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewVulnerabilityModal } from "@/shared/components/modal/view-vulnerability-modal";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * Volume 페이지 공통 레이아웃
 *
 * Hub 패턴을 따라 공통 레이아웃을 정의하고
 * children 슬롯을 통해 list/detail aside 컨텐츠를 렌더링합니다.
 *
 * - /user/volume → VolumeListMain (자동 리다이렉트 로직 포함)
 * - /user/volume/[id] → VolumeDetailMain (URL 파라미터 기반)
 */
export default function UserVolumeLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const page = useAtomValue(volumePageAtom);
  const searchText = useAtomValue(volumeSearchTextAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId ?? 0;
  const pathname = usePathname();
  const isVolumeListPage = pathname === ROUTES.USER_VOLUME;

  const { data, isLoading, isError } = useGetVolumeList(
    {
      pageNo: page - 1,
      pageSize: VOLUME_PAGE_SIZE,
      keyword: searchText || undefined,
      workspaceId,
    },
    {
      query: {
        enabled: !!workspaceId,
      },
    },
  );

  // orval 응답에서 데이터 추출 (customInstance가 BaseResponse.data를 자동 언랩)
  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  // 목록 페이지에서만 첫 번째 볼륨으로 자동 리다이렉트
  useEffect(() => {
    if (content.length === 0) return;

    if (isVolumeListPage && content[0]) {
      router.push(ROUTES.USER_VOLUME_DETAIL(content[0].volumeId));
    }
  }, [isVolumeListPage, content, router]);

  return (
    <>
      <PageHeader pageKey="user.volume" />
      <ListPageMain>
        <ListPageBody>
          <VolumeListFilter total={totalSize} loading={isLoading} />
          <VolumeListBody
            content={content}
            loading={isLoading}
            isError={isError}
          />
          <VolumeListFooter total={totalSize} loading={isLoading} />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
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
