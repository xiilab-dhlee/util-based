"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import type { TableProps } from "xiilab-ui";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { createWorkspaceMemberColumn } from "@/domain/setting/columns/create-workspace-member-column";
import {
  WORKSPACE_MEMBER_SORT_FIELDS,
  type WorkspaceMemberSortField,
} from "@/domain/setting/constants/setting.constant";
import {
  settingMemberPageAtom,
  settingMemberSortAtom,
} from "@/domain/setting/state/setting.atom";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SettingMemberListBodyProps {
  members: WorkspaceMemberResponse[];
  isLoading?: boolean;
  isError?: boolean;
}

const MANAGEABLE_COLUMN_KEYS = ["accountName", "email", "memberRole"] as const;
const MANAGEABLE_WITH_ACTION_COLUMN_KEYS = [
  ...MANAGEABLE_COLUMN_KEYS,
  "edit",
  "delete",
] as const;

type ColumnKey =
  | (typeof MANAGEABLE_COLUMN_KEYS)[number]
  | (typeof MANAGEABLE_WITH_ACTION_COLUMN_KEYS)[number];

const toColumnConfigs = (
  keys: readonly ColumnKey[],
): CoreCreateColumnConfig[] => keys.map((key) => ({ key }));

export function SettingMemberListBody({
  members,
  isLoading = false,
  isError = false,
}: SettingMemberListBodyProps) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const { data: session } = useSession();
  const [sort, setSort] = useAtom(settingMemberSortAtom);
  const resetPage = useResetAtom(settingMemberPageAtom);

  const workspaceId = selectedWorkspace?.workspaceId ?? -1;
  const accountId = getSessionAccountId(session);

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId,
    accountId ?? "",
    {
      query: {
        enabled: Boolean(selectedWorkspace?.workspaceId) && Boolean(accountId),
      },
    },
  );

  const canManageWorkspace = isWorkspaceOwnerRole(memberRole?.memberRole);

  const columns = createWorkspaceMemberColumn(
    sort,
    toColumnConfigs(
      canManageWorkspace
        ? MANAGEABLE_WITH_ACTION_COLUMN_KEYS
        : MANAGEABLE_COLUMN_KEYS,
    ),
  );

  const handleChange: TableProps<WorkspaceMemberResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      WorkspaceMemberResponse,
      WorkspaceMemberSortField
    >(sorter, WORKSPACE_MEMBER_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field,
      order: parsed.order,
    });
    resetPage();
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={columns}
        data={members}
        rowKey="accountId"
        activePadding
        loading={isLoading}
        isError={isError}
        scroll={{ x: "100%" }}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
