"use client";

import { useAtomValue } from "jotai";

import { requestResourcePageAtom } from "@/domain/request-resource/state/request-resource.atom";
import { useGetWorkspaceRequestResources } from "@/domain/workspace/hooks/use-get-workspace-request-resources";
import { requestResourceColumn } from "@/shared/components/column/workspace-request-resource-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
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
