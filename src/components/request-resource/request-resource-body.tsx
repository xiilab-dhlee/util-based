"use client";

import { useAtomValue } from "jotai";

import { requestResourcePageAtom } from "@/atoms/request-resource.atom";
import { requestResourceColumn } from "@/components/common/column/workspace-request-resource-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetWorkspaceRequestResources } from "@/hooks/workspace/use-get-workspace-request-resources";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function RequestResourceBody() {
  // 페이지 번호
  const page = useAtomValue(requestResourcePageAtom);

  const { data } = useGetWorkspaceRequestResources({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={requestResourceColumn}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}
