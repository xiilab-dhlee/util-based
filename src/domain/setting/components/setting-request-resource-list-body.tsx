"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { TableProps } from "xiilab-ui";

import type { ResourceRequestListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createSettingRequestResourceColumn } from "@/domain/setting/components/column/create-setting-request-resource-column";
import {
  SETTING_REQUEST_RESOURCE_SORT_FIELDS,
  type SettingRequestResourceSortField,
} from "@/domain/setting/constants/setting.constant";
import {
  settingRequestResourcePageAtom,
  settingRequestResourceSortAtom,
} from "@/domain/setting/state/setting.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SettingRequestResourceListBodyProps {
  items: ResourceRequestListResponse[];
  isLoading: boolean;
  isError: boolean;
  canManageWorkspace?: boolean;
}

const MANAGEABLE_COLUMN_KEYS = [
  "creatorName",
  "requestedAt",
  "gpu",
  "mps",
  "mig",
  "cpu",
  "memory",
  "approvalStatus",
  "approvedAt",
  "rejectReason",
  "requestReason",
] as const;

const MANAGEABLE_WITH_ACTION_COLUMN_KEYS = [
  ...MANAGEABLE_COLUMN_KEYS,
  "cancel",
] as const;

type ColumnKey =
  | (typeof MANAGEABLE_COLUMN_KEYS)[number]
  | (typeof MANAGEABLE_WITH_ACTION_COLUMN_KEYS)[number];

const toColumnConfigs = (
  keys: readonly ColumnKey[],
): CoreCreateColumnConfig[] => keys.map((key) => ({ key }));

const ALLOWED_SORT_FIELDS = Object.values(SETTING_REQUEST_RESOURCE_SORT_FIELDS);

export function SettingRequestResourceListBody({
  items,
  isLoading,
  isError,
  canManageWorkspace = false,
}: SettingRequestResourceListBodyProps) {
  const [sortState, setSortState] = useAtom(settingRequestResourceSortAtom);
  const resetPage = useResetAtom(settingRequestResourcePageAtom);

  const columns = createSettingRequestResourceColumn(
    {
      sortState,
    },
    toColumnConfigs(
      canManageWorkspace
        ? MANAGEABLE_WITH_ACTION_COLUMN_KEYS
        : MANAGEABLE_COLUMN_KEYS,
    ),
  );

  const handleChange: TableProps<ResourceRequestListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const next = parseSorterToAntdState<
      ResourceRequestListResponse,
      SettingRequestResourceSortField
    >(sorter, ALLOWED_SORT_FIELDS);

    setSortState({ field: next.field, order: next.order });

    resetPage();
  };

  return (
    <ListWrapper>
      <CustomizedTable<ResourceRequestListResponse>
        columns={columns}
        data={items}
        loading={isLoading}
        isError={isError}
        activePadding
        rowKey="resourceRequestId"
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
