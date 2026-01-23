"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import type { ResourceRequestSortRequestSort } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ResourceRequestSortRequestSort as ResourceRequestSortRequestSortEnum } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetResourceRequests } from "@/api/generated/workspace/workspace";
import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { SettingRequestResourceListBody } from "@/domain/setting/components/setting-request-resource-list-body";
import { SettingRequestResourceListFilter } from "@/domain/setting/components/setting-request-resource-list-filter";
import { SettingRequestResourceListFooter } from "@/domain/setting/components/setting-request-resource-list-footer";
import {
  RESOURCE_REQUEST_LIST_PAGE_SIZE,
  SETTING_REQUEST_RESOURCE_SORT_FIELDS,
  type SettingRequestResourceSortField,
} from "@/domain/setting/constants/setting.constant";
import {
  openCreateResourceRequestModalAtom,
  settingRequestResourcePageAtom,
  settingRequestResourceSortAtom,
} from "@/domain/setting/state/setting.atom";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { buildSortRequest } from "@/shared/utils/sort.util";

const RESOURCE_REQUEST_SORT_FIELD_MAP: Record<
  SettingRequestResourceSortField,
  ResourceRequestSortRequestSort
> = {
  [SETTING_REQUEST_RESOURCE_SORT_FIELDS.CREATOR_NAME]:
    ResourceRequestSortRequestSortEnum.CREATOR_NAME,
  [SETTING_REQUEST_RESOURCE_SORT_FIELDS.REQUESTED_AT]:
    ResourceRequestSortRequestSortEnum.REQUESTED_AT,
  [SETTING_REQUEST_RESOURCE_SORT_FIELDS.APPROVAL_STATUS]:
    ResourceRequestSortRequestSortEnum.APPROVAL_STATUS,
};

export function SettingRequestResourceListMain() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const { data: session } = useSession();

  const workspaceId = selectedWorkspace?.workspaceId;
  const accountId = getSessionAccountId(session);

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId ?? 0,
    accountId ?? "",
    {
      query: {
        enabled: Boolean(selectedWorkspace?.workspaceId) && Boolean(accountId),
      },
    },
  );

  const canManageWorkspace = isWorkspaceOwnerRole(memberRole?.memberRole);

  const { onOpen } = useGlobalModal(openCreateResourceRequestModalAtom);
  const page = useAtomValue(settingRequestResourcePageAtom);
  const sortState = useAtomValue(settingRequestResourceSortAtom);

  const resetPage = useResetAtom(settingRequestResourcePageAtom);
  const resetSort = useResetAtom(settingRequestResourceSortAtom);

  // 페이지 진입 시 정렬 및 페이지네이션 초기화
  useEffect(() => {
    resetPage();
    resetSort();
  }, [resetPage, resetSort]);

  const sortRequest = buildSortRequest<
    SettingRequestResourceSortField,
    ResourceRequestSortRequestSort
  >({
    state: sortState,
    fieldMap: RESOURCE_REQUEST_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetResourceRequests(
    workspaceId ?? 0,
    {
      pageableRequest: {
        pageNo: Math.max(0, page - 1),
        pageSize: RESOURCE_REQUEST_LIST_PAGE_SIZE,
      },
      sortRequest: {
        sort: sortRequest?.sort ?? "REQUESTED_AT",
        order: sortRequest?.order ?? "DESC",
      },
    },
    { query: { enabled: workspaceId !== undefined } },
  );

  const totalSize = data?.totalSize ?? 0;

  return (
    <>
      <SettingRequestResourceListFilter
        totalSize={totalSize}
        onOpenCreate={onOpen}
        canManageWorkspace={canManageWorkspace}
      />
      <SettingRequestResourceListBody
        items={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
        canManageWorkspace={canManageWorkspace}
      />
      <SettingRequestResourceListFooter
        totalSize={totalSize}
        isLoading={isLoading}
      />
    </>
  );
}
