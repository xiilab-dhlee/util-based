"use client";

import { useAtomValue } from "jotai";

import { useGetWorkloadVulnerabilities } from "@/domain/workload/hooks/use-get-workload-vulnerabilities";
import { workloadSecurityPageAtom } from "@/domain/workload/state/workload.atom";
import { createVulnerabilityColumn } from "@/shared/components/column/create-vulnerability-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function WorkloadSecurityBody() {
  // 페이지 번호
  const page = useAtomValue(workloadSecurityPageAtom);

  const { data } = useGetWorkloadVulnerabilities({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createVulnerabilityColumn()}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}
