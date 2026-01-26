"use client";

import { SecurityTotalColumnHeader } from "@/domain/security/components/security-total-column-header";
import type { SecurityScanResultType } from "@/domain/security/schemas/security-scan.schema";
import { securityScanListMock } from "@/mocks/data/security-scan.mock";
import { createSecurityColumn } from "@/shared/components/column/create-security-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function SecurityScanListBody() {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createSecurityColumn([
          { key: "imageTag" },
          { key: "status" },
          {
            key: "total",
            title: <SecurityTotalColumnHeader />,
            render: (_: unknown, record: SecurityScanResultType) => {
              return (
                <ColumnAlignCenterWrap>
                  <VulnerabilityTooltip
                    critical={record.critical}
                    high={record.high}
                    medium={record.medium}
                    low={record.low}
                  />
                </ColumnAlignCenterWrap>
              );
            },
          },
          { key: "creatorName", title: "실행자" },
          { key: "playtime" },
          { key: "creatorDateTime", title: "검사일시" },
        ])}
        data={securityScanListMock}
        activePadding
      />
    </ListWrapper>
  );
}
