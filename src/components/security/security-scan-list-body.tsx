"use client";

import { CustomizedTable } from "@/components/common/table/customized-table";
import registrySecurityConstants from "@/constants/security/registry-security.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { createSecurityColumn } from "../common/column/create-security-column";

export function SecurityScanListBody() {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createSecurityColumn([
          { dataIndex: "imageTag" },
          { dataIndex: "status" },
          { dataIndex: "total" },
          { dataIndex: "critical" },
          { dataIndex: "high" },
          { dataIndex: "medium" },
          { dataIndex: "low" },
          { dataIndex: "creatorName", title: "실행자" },
          { dataIndex: "playtime" },
          { dataIndex: "creatorDateTime", title: "검사일시" },
        ])}
        data={Array.from({
          length: registrySecurityConstants.scanResultPageSize,
        }).map((_, index) => ({
          id: index + 1,
          imageTag: "Dev Snapshot-1 : v1.2",
          status: "완료",
          total: 11,
          critical: 1,
          high: 2,
          medium: 3,
          low: 5,
          creatorName: "John Doe",
          playtime: "11분 18초",
          creatorDateTime: new Date().toISOString(),
        }))}
        activePadding
      />
    </ListWrapper>
  );
}
