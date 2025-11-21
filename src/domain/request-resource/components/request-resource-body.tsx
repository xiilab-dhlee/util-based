"use client";

import { useAtomValue } from "jotai";

import { useGetWorkspaceRequestResources } from "@/domain/request-resource/hooks/use-get-request-resources";
import { requestResourcePageAtom } from "@/domain/request-resource/state/request-resource.atom";
import { createRequestResourceColumn } from "@/shared/components/column/create-request-resource-column";
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
        columns={createRequestResourceColumn()}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}
