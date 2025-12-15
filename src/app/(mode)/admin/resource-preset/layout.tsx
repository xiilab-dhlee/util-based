"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { CreateResourcePresetDrawer } from "@/domain/resource-preset/components/create/create-resource-preset-drawer";
import { DeleteResourcePresetModal } from "@/domain/resource-preset/components/delete-resource-preset-modal";
import { ResourcePresetListBody } from "@/domain/resource-preset/components/list/resource-preset-list-body";
import { ResourcePresetListFilter } from "@/domain/resource-preset/components/list/resource-preset-list-filter";
import { ResourcePresetListFooter } from "@/domain/resource-preset/components/list/resource-preset-list-footer";
import { useGetResourcePresets } from "@/domain/resource-preset/hooks/use-get-resource-presets";
import {
  resourcePresetJobTypeAtom,
  resourcePresetNodeTypeAtom,
  resourcePresetPageAtom,
  resourcePresetSearchTextAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { openDrawerWithInitAtom } from "@/domain/resource-preset/state/resource-preset-form.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGetGpuNodes } from "@/shared/hooks/use-get-gpu-nodes";
import { useGetGpus } from "@/shared/hooks/use-get-gpus";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 리소스 프리셋 관리 목록 페이지 레이아웃
 */
export default function AdminResourcePresetLayout({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  // 필터 상태
  const page = useAtomValue(resourcePresetPageAtom);
  const search = useAtomValue(resourcePresetSearchTextAtom);
  const jobType = useAtomValue(resourcePresetJobTypeAtom);
  const nodeType = useAtomValue(resourcePresetNodeTypeAtom);

  // 목록 조회
  const {
    data: response,
    isLoading,
    isError,
  } = useGetResourcePresets({
    page,
    size: LIST_PAGE_SIZE,
    search: search || undefined,
    jobType: jobType || undefined,
    nodeType: nodeType || undefined,
  });

  const data = response?.content ?? [];
  const total = response?.totalSize ?? 0;

  // GPU 데이터 (Drawer 열 때 필요)
  const { data: gpuData } = useGetGpus();
  const { data: gpuNodeData } = useGetGpuNodes();

  // Drawer 열기 액션
  const openDrawerWithInit = useSetAtom(openDrawerWithInitAtom);

  /**
   * 목록 페이지 진입 시 첫 번째 아이템 자동 선택
   */
  useEffect(() => {
    const isListPage = pathname === ROUTES.ADMIN_RESOURCE_PRESET;
    const hasData = data && data.length > 0;

    if (isListPage && hasData) {
      const firstItemId = data[0].id;
      router.replace(ROUTES.ADMIN_RESOURCE_PRESET_DETAIL(firstItemId));
    }
  }, [pathname, data, router]);

  /** 추가 버튼 클릭 핸들러 */
  const handleClickAdd = () => {
    openDrawerWithInit({
      gpuList: gpuData?.content ?? [],
      nodeList: gpuNodeData?.content ?? [],
    });
  };

  return (
    <>
      <PageHeader
        pageKey="admin.resource-preset"
        description="Resource Preset Management"
      />
      {/* 리소스 프리셋 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 리소스 프리셋 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 리소스 프리셋 목록 필터 */}
          <ResourcePresetListFilter
            total={total}
            isLoading={isLoading}
            onClickAdd={handleClickAdd}
          />
          {/* 리소스 프리셋 목록 본문 */}
          <ResourcePresetListBody
            data={data}
            isLoading={isLoading}
            isError={isError}
          />
          {/* 리소스 프리셋 목록 페이지네이션 */}
          <ResourcePresetListFooter total={total} isLoading={isLoading} />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
      {/* 리소스 프리셋 생성 드로어 */}
      <CreateResourcePresetDrawer />
      {/* 리소스 프리셋 삭제 모달 */}
      <DeleteResourcePresetModal />
    </>
  );
}
