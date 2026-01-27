"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useGetPresets } from "@/api/generated/admin-resource-preset/admin-resource-preset";
import { ResourcePresetListBody } from "@/domain/resource-preset/components/list/resource-preset-list-body";
import { ResourcePresetListFilter } from "@/domain/resource-preset/components/list/resource-preset-list-filter";
import { ResourcePresetListFooter } from "@/domain/resource-preset/components/list/resource-preset-list-footer";
import {
  resourcePresetJobTypeAtom,
  resourcePresetNodeTypeAtom,
  resourcePresetOrderAtom,
  resourcePresetPageAtom,
  resourcePresetSearchTextAtom,
  resourcePresetSortAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { openCreateResourcePresetDrawerAtom } from "@/domain/resource-preset/state/resource-preset-form.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";

/**
 * 리소스 프리셋 목록 페이지 메인 컴포넌트
 */
export function ResourcePresetListMain() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const hasRedirected = useRef(false);

  // 필터 상태
  const page = useAtomValue(resourcePresetPageAtom);
  const search = useAtomValue(resourcePresetSearchTextAtom);
  const jobType = useAtomValue(resourcePresetJobTypeAtom);
  const nodeType = useAtomValue(resourcePresetNodeTypeAtom);
  const sort = useAtomValue(resourcePresetSortAtom);
  const order = useAtomValue(resourcePresetOrderAtom);

  // 목록 조회 (orval 훅)
  const {
    data: response,
    isLoading,
    isError,
  } = useGetPresets({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: search || undefined,
    workloadJobType: jobType || undefined,
    nodeType: nodeType || undefined,
    sort: sort || undefined,
    order: order || undefined,
  });

  const data = response?.content ?? [];
  const total = response?.totalSize ?? 0;

  // Drawer 열기 액션
  const setOpenCreateResourcePresetDrawer = useSetAtom(
    openCreateResourcePresetDrawerAtom,
  );

  // 첫 번째 프리셋 ID 추출 (리다이렉트용)
  const firstPresetId = data[0]?.resourcePresetId;

  /**
   * URL에 id가 없고 데이터가 있으면 첫 번째 프리셋으로 리다이렉트
   */
  useEffect(() => {
    if (!params.id && !isLoading && firstPresetId && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(
        ROUTES.ADMIN_RESOURCE_PRESET_DETAIL(String(firstPresetId)),
      );
    }
  }, [params.id, isLoading, firstPresetId, router]);

  /** 추가 버튼 클릭 핸들러 */
  const handleClickAdd = () => {
    setOpenCreateResourcePresetDrawer(true);
  };

  return (
    <>
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
        activeRowKey={params.id}
      />
      {/* 리소스 프리셋 목록 페이지네이션 */}
      <ResourcePresetListFooter total={total} isLoading={isLoading} />
    </>
  );
}
