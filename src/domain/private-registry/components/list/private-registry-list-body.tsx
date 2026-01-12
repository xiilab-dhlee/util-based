"use client";

import type { RegistryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { privateregistryListColumn } from "@/domain/private-registry/components/list/private-registry-list-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface PrivateRegistryListBodyProps {
  data: RegistryListResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function PrivateRegistryListBody({
  data,
  isLoading,
  isError,
}: PrivateRegistryListBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={privateregistryListColumn}
        data={data}
        columnHeight={38}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="imageId"
      />
    </ListWrapper>
  );
}
