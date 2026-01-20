"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { useGetVolumeList } from "@/api/generated/volume/volume";
import { CompressVolumeFileModal } from "@/domain/volume/components/compress-volume-file-modal";
import { CreateAstragoVolumeModal } from "@/domain/volume/components/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/domain/volume/components/create-onprem-volume-modal";
import { CreateVolumeFolderModal } from "@/domain/volume/components/create-volume-folder-modal";
import { DecompressVolumeFileModal } from "@/domain/volume/components/decompress-volume-file-modal";
import { DeleteVolumeFileModal } from "@/domain/volume/components/delete-volume-file-modal";
import { DeleteVolumeModal } from "@/domain/volume/components/delete-volume-modal";
import { DownloadVolumeFileModal } from "@/domain/volume/components/download-volume-file-modal";
import { VolumeListBody } from "@/domain/volume/components/list/volume-list-body";
import { VolumeListFilter } from "@/domain/volume/components/list/volume-list-filter";
import { VolumeListFooter } from "@/domain/volume/components/list/volume-list-footer";
import { SelectVolumeTypeModal } from "@/domain/volume/components/select-volume-type-modal";
import { UploadVolumeFileModal } from "@/domain/volume/components/upload-volume-file-modal";
import { VOLUME_PAGE_SIZE } from "@/domain/volume/constants/volume.constant";
import {
  volumeOrderSortAtom,
  volumePageAtom,
  volumeSearchTextAtom,
  volumeTypeSortAtom,
} from "@/domain/volume/state/volume.atom";
import { parseVolumeSortValue } from "@/domain/volume/utils/volume.util";
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

type VolumeMode = "user" | "admin";

interface VolumeLayoutProps extends PropsWithChildren {
  mode: VolumeMode;
}

const VOLUME_ROUTES = {
  user: {
    list: ROUTES.USER_VOLUME,
    detail: ROUTES.USER_VOLUME_DETAIL,
    pageKey: "user.volume" as const,
  },
  admin: {
    list: ROUTES.ADMIN_VOLUME,
    detail: ROUTES.ADMIN_VOLUME_DETAIL,
    pageKey: "admin.volume" as const,
  },
};

/**
 * Volume 페이지 공통 레이아웃
 *
 * User/Admin 모드에 따라 라우트와 API 호출 방식이 달라집니다.
 * - User 모드: workspaceId 기반 볼륨 조회
 * - Admin 모드: 전체 볼륨 조회
 */
export function VolumeLayout({ mode, children }: VolumeLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const page = useAtomValue(volumePageAtom);
  const searchText = useAtomValue(volumeSearchTextAtom);
  const sort = useAtomValue(volumeOrderSortAtom);
  const volumeType = useAtomValue(volumeTypeSortAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const routes = VOLUME_ROUTES[mode];
  const isVolumeListPage = pathname === routes.list;
  const sortParams = parseVolumeSortValue(sort);

  // User 모드에서만 workspaceId 사용
  const isUserMode = mode === "user";
  const workspaceId = isUserMode
    ? (selectedWorkspace?.workspaceId ?? 0)
    : undefined;

  const { data, isLoading, isError } = useGetVolumeList(
    {
      pageNo: page - 1,
      pageSize: VOLUME_PAGE_SIZE,
      keyword: searchText || undefined,
      workspaceId,
      sort: sortParams?.sort,
      order: sortParams?.order,
      volumeType: volumeType ?? undefined,
    },
    {
      query: {
        // User 모드에서만 workspaceId 조건 체크
        enabled: isUserMode ? !!workspaceId : true,
      },
    },
  );

  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  // 목록 페이지에서만 첫 번째 볼륨으로 자동 리다이렉트
  useEffect(() => {
    if (content.length === 0) return;

    if (isVolumeListPage && content[0]) {
      router.replace(routes.detail(content[0].volumeId));
    }
  }, [isVolumeListPage, content, router, routes]);

  return (
    <>
      <PageHeader pageKey={routes.pageKey} />
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
      {/* 볼륨 파일 압축 해제 모달 */}
      <DecompressVolumeFileModal />
      {/* 볼륨 폴더 추가 모달 */}
      <CreateVolumeFolderModal />
      {/* 볼륨 파일 삭제 모달 */}
      <DeleteVolumeFileModal />
      {/* 볼륨 파일 다운로드 모달 */}
      <DownloadVolumeFileModal />
      {/* 볼륨 파일 업로드 모달 */}
      <UploadVolumeFileModal />
    </>
  );
}
