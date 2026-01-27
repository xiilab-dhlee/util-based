"use client";

import type { SorterResult } from "antd/es/table/interface";
import { useAtom, useSetAtom } from "jotai";

import type { ResourcePresetResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  GetPresetsOrder,
  GetPresetsSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createResourcePresetListColumn } from "@/domain/resource-preset/columns/create-resource-preset-list-column";
import {
  resourcePresetCheckedListAtom,
  resourcePresetOrderAtom,
  resourcePresetSortAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/** 컬럼 key → API sort 필드 매핑 */
const SORT_FIELD_MAP: Record<string, GetPresetsSort> = {
  presetName: GetPresetsSort.PRESET_NAME,
  createdAt: GetPresetsSort.CREATED_AT,
};

const RESOURCE_PRESET_LIST_COLUMNS = createResourcePresetListColumn();

const getResourcePresetRowKey = (record: ResourcePresetResponse) => {
  return String(record.resourcePresetId);
};

interface ResourcePresetListBodyProps {
  /** 리소스 프리셋 목록 데이터 */
  data: ResourcePresetResponse[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  isError: boolean;
  /** 활성화된 행의 키 값 */
  activeRowKey?: string | number;
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
  activeRowKey,
}: ResourcePresetListBodyProps) {
  const normalizedActiveRowKey = activeRowKey
    ? String(activeRowKey)
    : undefined;
  const [checkedList, setCheckedList] = useAtom(resourcePresetCheckedListAtom);
  const { rowSelection } = useTableSelection<ResourcePresetResponse>(
    checkedList,
    setCheckedList,
  );

  const setSort = useSetAtom(resourcePresetSortAtom);
  const setOrder = useSetAtom(resourcePresetOrderAtom);

  const handleTableChange = (
    _pagination: unknown,
    _filters: unknown,
    sorter:
      | SorterResult<ResourcePresetResponse>
      | SorterResult<ResourcePresetResponse>[],
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    if (!singleSorter?.columnKey || !singleSorter.order) {
      setSort(undefined);
      setOrder(undefined);
      return;
    }

    const sortField = SORT_FIELD_MAP[singleSorter.columnKey as string];
    if (!sortField) {
      setSort(undefined);
      setOrder(undefined);
      return;
    }

    setSort(sortField);
    setOrder(
      singleSorter.order === "ascend"
        ? GetPresetsOrder.ASC
        : GetPresetsOrder.DESC,
    );
  };

  return (
    <ListWrapper>
      <CustomizedTable<ResourcePresetResponse>
        columns={RESOURCE_PRESET_LIST_COLUMNS}
        data={data}
        rowKey={getResourcePresetRowKey}
        activeRowKey={normalizedActiveRowKey}
        rowSelection={rowSelection}
        activePadding
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        onChange={handleTableChange}
      />
    </ListWrapper>
  );
}
