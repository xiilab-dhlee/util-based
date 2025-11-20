"use client";

import { vulnerabilityListMock } from "@/mocks/data/vulnerability.mock";
import { createSecurityColumn } from "@/shared/components/column/create-security-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

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
        data={vulnerabilityListMock}
        activePadding
      />
    </ListWrapper>
  );
}
