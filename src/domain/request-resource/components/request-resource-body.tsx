"use client";

import { useAtomValue } from "jotai";

import { requestResourcePageAtom } from "@/domain/request-resource/state/request-resource.atom";
import { createRequestResourceColumn } from "@/shared/components/column/create-request-resource-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { useGetRequestResources } from "../hooks/use-get-request-resources";

export function RequestResourceBody() {
  const page = useAtomValue(requestResourcePageAtom);

  const { data } = useGetRequestResources({
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
