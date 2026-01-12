"use client";

import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { createWorkspaceMemberColumn } from "@/domain/setting/columns/create-workspace-member-column";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
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

  const workspaceId = selectedWorkspace?.workspaceId ?? -1;
  const accountId = session?.user?.id ?? "";

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId,
    accountId,
    {
      query: {
        enabled: Boolean(selectedWorkspace?.workspaceId) && Boolean(accountId),
      },
    },
  );

  const canManageWorkspace = isWorkspaceOwnerRole(memberRole?.memberRole);

  const columns = createWorkspaceMemberColumn(
    toColumnConfigs(
      canManageWorkspace
        ? MANAGEABLE_WITH_ACTION_COLUMN_KEYS
        : MANAGEABLE_COLUMN_KEYS,
    ),
  );

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
      />
    </ListWrapper>
  );
}
