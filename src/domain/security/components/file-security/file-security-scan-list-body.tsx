"use client";

import { useAtomValue } from "jotai";

import { SecurityTotalColumnHeader } from "@/domain/security/components/security-total-column-header";
import { useGetFileSecurityScanList } from "@/domain/security/hooks/use-get-file-security-scan-list";
import type { FileSecurityScanResultType } from "@/domain/security/schemas/file-security-scan.schema";
import { fileSecurityScanListPageAtom } from "@/domain/security/state/file-security.atom";
import { createFileSecurityScanColumn } from "@/shared/components/column/create-file-security-scan-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function FileSecurityScanListBody() {
  const page = useAtomValue(fileSecurityScanListPageAtom);

  const { data, isLoading, isError } = useGetFileSecurityScanList({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createFileSecurityScanColumn([
          { dataIndex: "creatorDateTime", title: "검사일시" },
          { dataIndex: "scanType", title: "구분" },
          { dataIndex: "status", title: "검사 상태" },
          {
            dataIndex: "total",
            title: <SecurityTotalColumnHeader />,
            render: (_: unknown, record: FileSecurityScanResultType) => {
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
          { dataIndex: "playtime", title: "검사 소요 시간" },
          { dataIndex: "creatorName", title: "실행자" },
        ])}
        data={data?.content || []}
        loading={isLoading}
        isError={isError}
        activePadding
      />
    </ListWrapper>
  );
}
