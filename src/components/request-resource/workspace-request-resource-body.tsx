"use client";

import { useAtomValue } from "jotai";

import { workspaceRequestResourcePageAtom } from "@/atoms/workspace/workspace-request-resource.atom";
import { workspaceRequestResourceColumn } from "@/components/common/column/workspace-request-resource-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetWorkspaceRequestResources } from "@/hooks/workspace/use-get-workspace-request-resources";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function WorkspaceRequestResourceBody() {
  // 페이지 번호
  const page = useAtomValue(workspaceRequestResourcePageAtom);

  const { data } = useGetWorkspaceRequestResources({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={workspaceRequestResourceColumn}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}
