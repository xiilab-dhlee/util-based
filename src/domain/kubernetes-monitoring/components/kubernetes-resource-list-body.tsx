"use client";

import type { KubernetesResourceItem } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { kubernetesResourceListColumn } from "./kubernetes-resource-list-column";

interface KubernetesResourceListBodyProps {
  items: KubernetesResourceItem[];
  isLoading: boolean;
  isError: boolean;
}

export function KubernetesResourceListBody({
  items,
  isLoading,
  isError,
}: KubernetesResourceListBodyProps) {
  const dataSource = items.map((item, index) => ({
    ...item,
    id: `${item.resourceName}-${item.namespace}-${item.createDateTime}-${index}`,
  }));

  return (
    <ListWrapper>
      <CustomizedTable
        loading={isLoading}
        isError={isError}
        columns={kubernetesResourceListColumn}
        data={dataSource}
        activePadding
      />
    </ListWrapper>
  );
}
