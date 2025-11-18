"use client";

import { CustomizedTable } from "@/components/common/table/customized-table";
import { vulnerabilityListMock } from "@/mocks/vulnerability.mock";
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
        data={vulnerabilityListMock}
        activePadding
      />
    </ListWrapper>
  );
}
