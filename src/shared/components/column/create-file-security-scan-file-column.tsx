import type { ResponsiveColumnType } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type {
  FileScanStatus,
  FileSecurityScanFileType,
} from "@/domain/security/schemas/file-security-scan.schema";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import { ROUTES } from "@/shared/constants/routes.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import type { VulnerabilityStatus } from "@/shared/types/vulnerability-status.type";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDurationFromSeconds } from "@/shared/utils/date.util";
import { getVulnerabilityStatusInfo } from "@/shared/utils/vulnerability.util";
import {
  ColumnAlignCenterWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

const createColumnList = (scanId: number): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "volumeName",
      title: "볼륨 이름",
      align: "left",
      width: 150,
      render: (volumeName: string, record: FileSecurityScanFileType) => {
        return (
          <ColumnLink
            href={ROUTES.ADMIN_FILE_SECURITY_VULNERABILITY(scanId, record.id)}
          >
            {volumeName}
          </ColumnLink>
        );
      },
    },
    {
      dataIndex: "fileName",
      title: "파일 이름",
      align: "left",
      width: 150,
    },
    {
      dataIndex: "filePath",
      title: "파일 경로",
      align: "left",
    },
    {
      dataIndex: "status",
      title: "검사 상태",
      align: "center",
      width: 100,
      render: (status: FileScanStatus) => {
        const { label, variant } = getVulnerabilityStatusInfo(
          status as VulnerabilityStatus,
        );
        return <Label variant={variant}>{label}</Label>;
      },
    },
    {
      dataIndex: "total",
      title: "총 취약점 개수",
      align: "center",
      width: 130,
      render: (_: unknown, record: FileSecurityScanFileType) => {
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
  ];
};

export const createFileSecurityScanFileColumn = (
  scanId: number,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(scanId);

  return applyColumnConfigs(columnList, config);
};
