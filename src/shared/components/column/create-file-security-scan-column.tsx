import type { ResponsiveColumnType } from "xiilab-ui";

import { FILE_SCAN_TYPE_LABEL } from "@/domain/security/constants/file-security-scan.constant";
import type {
  FileScanStatus,
  FileScanType,
  FileSecurityScanResultType,
} from "@/domain/security/schemas/file-security-scan.schema";
import { renderFileScanStatusLabel } from "@/domain/security/utils/file-security-scan-status.util";
import { ROUTES } from "@/shared/constants/routes.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  formatDateTimeSafely,
  formatDurationFromSeconds,
} from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

/**
 * 검사 유형 라벨 반환
 */
function getScanTypeLabel(scanType: FileScanType) {
  return FILE_SCAN_TYPE_LABEL[scanType] ?? "-";
}

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "id",
      title: "검사 ID",
      align: "left",
      width: 100,
      render: (_: unknown, record: FileSecurityScanResultType) => {
        return (
          <ColumnLink href={ROUTES.ADMIN_FILE_SECURITY_SCAN(record.id)}>
            {record.id}
          </ColumnLink>
        );
      },
    },
    {
      dataIndex: "creatorDateTime",
      title: "검사일시",
      align: "center",
      width: 140,
      render: (creatorDateTime: string, record: FileSecurityScanResultType) => {
        return (
          <ColumnLink href={ROUTES.ADMIN_FILE_SECURITY_SCAN(record.id)}>
            {formatDateTimeSafely(creatorDateTime) ?? "-"}
          </ColumnLink>
        );
      },
    },
    {
      dataIndex: "scanType",
      title: "구분",
      align: "center",
      width: 80,
      render: (scanType: FileScanType) => {
        return (
          <ColumnAlignCenterWrap>
            {getScanTypeLabel(scanType)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "status",
      title: "검사 상태",
      align: "center",
      width: 100,
      render: (status: FileScanStatus) => {
        return (
          <ColumnAlignCenterWrap>
            {renderFileScanStatusLabel(status)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "total",
      title: "총 취약점 개수",
      align: "center",
      width: 120,
      render: (_: unknown, record: FileSecurityScanResultType) => {
        return record.critical + record.high + record.medium + record.low;
      },
    },
    {
      dataIndex: "critical",
      title: "Critical",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--red-main)" }}>{value}</span>;
      },
    },
    {
      dataIndex: "high",
      title: "High",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--orange-main)" }}>{value}</span>;
      },
    },
    {
      dataIndex: "medium",
      title: "Medium",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--blue-main)" }}>{value}</span>;
      },
    },
    {
      dataIndex: "low",
      title: "Low",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--green-main)" }}>{value}</span>;
      },
    },
    {
      dataIndex: "playtime",
      title: "검사 소요 시간",
      width: 120,
      align: "center",
      render: (playtime: number) => {
        if (!Number.isFinite(playtime)) {
          return <span>-</span>;
        }

        return <span>{formatDurationFromSeconds(playtime)}</span>;
      },
    },
    {
      dataIndex: "creatorName",
      title: "실행자",
      align: "center",
      width: 100,
    },
  ];
};

export const createFileSecurityScanColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
