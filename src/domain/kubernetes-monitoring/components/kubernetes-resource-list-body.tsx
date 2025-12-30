"use client";

import { useAtom } from "jotai";
import { useMemo } from "react";

import { kubernetesSelectedResourceNameAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { createKubernetesResourceColumn } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-list-column";
import type { AllResourceItem } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface KubernetesResourceListBodyProps {
  items: AllResourceItem[];
  isLoading: boolean;
  isError: boolean;
}

export function KubernetesResourceListBody({
  items,
  isLoading,
  isError,
}: KubernetesResourceListBodyProps) {
  const [selectedResourceName] = useAtom(kubernetesSelectedResourceNameAtom);

  // 현재 리소스 타입에 대한 컬럼 가져오기
  const columns = useMemo(
    () => createKubernetesResourceColumn(selectedResourceName),
    [selectedResourceName],
  );

  // 테이블 키를 위한 고유 ID 추가
  const dataSource = items.map((item, index) => {
    const namespace = "namespace" in item ? item.namespace : "";
    return {
      ...item,
      id: `${item.resourceName}-${namespace}-${index}`,
    };
  });

  return (
    <ListWrapper>
      <CustomizedTable
        loading={isLoading}
        isError={isError}
        columns={columns}
        data={dataSource}
        activePadding
      />
    </ListWrapper>
  );
}
