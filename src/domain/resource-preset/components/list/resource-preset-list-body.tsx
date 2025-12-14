"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { resourcePresetListColumn } from "@/domain/resource-preset/columns/create-resource-preset-list-column";
import type { ResourcePresetListType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import { resourcePresetCheckedListAtom } from "@/domain/resource-preset/state/resource-preset.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface ResourcePresetListBodyProps {
  /** 리소스 프리셋 목록 데이터 */
  data: ResourcePresetListType[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  isError: boolean;
}

/**
 * 리소스 프리셋 목록 페이지 본문 컴포넌트
 *
 * 리소스 프리셋 목록을 테이블 형태로 표시합니다.
 * rowSelection을 지원하여 다중 선택이 가능합니다.
 */
export function ResourcePresetListBody({
  data,
  isLoading,
  isError,
}: ResourcePresetListBodyProps) {
  const router = useRouter();
  const [checkedList, setCheckedList] = useAtom(resourcePresetCheckedListAtom);
  const { rowSelection } = useTableSelection<ResourcePresetListType>(
    checkedList,
    setCheckedList,
  );

  /**
   * 행 클릭 시 상세 페이지로 이동
   */
  const handleRowClick = (record: ResourcePresetListType) => {
    router.push(ROUTES.ADMIN_RESOURCE_PRESET_DETAIL(record.id));
  };

  return (
    <ListWrapper>
      <CustomizedTable<ResourcePresetListType>
        columns={resourcePresetListColumn}
        data={data}
        rowKey="id"
        rowSelection={rowSelection}
        activePadding
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        onRowClick={handleRowClick}
      />
    </ListWrapper>
  );
}
