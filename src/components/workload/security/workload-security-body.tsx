"use client";

import { useAtomValue } from "jotai";

import { workloadSecurityPageAtom } from "@/atoms/workload.atom";
import { createVulnerabilityColumn } from "@/components/common/column/create-vulnerability-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetWorkloadVulnerabilities } from "@/hooks/workload/use-get-workload-vulnerabilities";
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
