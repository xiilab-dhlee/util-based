"use client";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { createRequestResourceColumn } from "@/shared/components/column/create-request-resource-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RequestResourceBodyProps {
  data: RequestResourceListType[];
  isLoading: boolean;
  isError: boolean;
}

export function RequestResourceBody({
  data,
  isLoading,
  isError,
}: RequestResourceBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestResourceColumn()}
        data={data}
        activePadding
        loading={isLoading}
        isError={isError}
      />
    </ListWrapper>
  );
}
