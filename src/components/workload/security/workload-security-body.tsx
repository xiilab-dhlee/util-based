"use client";

import { useAtomValue } from "jotai";

import { workloadSecurityPageAtom } from "@/atoms/workload/workload-security.atom";
import { createVulnerabilityColumn } from "@/components/common/columns/create-vulnerability-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetWorkloadVulnerabilities } from "@/hooks/workload/use-get-workload-vulnerabilities";
import { Workload } from "@/models/workload.model";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function WorkloadSecurityBody() {
  // 페이지 번호
  const page = useAtomValue(workloadSecurityPageAtom);

  const { data } = useGetWorkloadVulnerabilities({
    page,
    size: Workload.SECURITY_PAGE_SIZE,
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
