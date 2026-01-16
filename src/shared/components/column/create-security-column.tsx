import type { ResponsiveColumnType } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type { SecurityScanResultType } from "@/domain/security/schemas/security-scan.schema";
import { creatorNameColumn } from "@/shared/components/column";
import { ROUTES } from "@/shared/constants/routes.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "imageTag",
      dataIndex: "imageTag",
      title: "이미지 : 태그",
      align: "left",
      render: (_, record: SecurityScanResultType) => {
        return (
          <ColumnLink
            href={ROUTES.ADMIN_REGISTRY_SECURITY_TAG(record.id, record.imageId)}
          >
            {record.imageName} : {record.imageTag}
          </ColumnLink>
        );
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "검사 상태",
      align: "center",
      width: 100,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <Label variant="blue">완료</Label>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "total",
      dataIndex: "total",
      title: "총 취약점 개수",
      align: "center",
      width: 120,
      render: (_: unknown, record: SecurityScanResultType) => {
        return record.critical + record.high + record.medium + record.low;
      },
    },
    {
      key: "critical",
      dataIndex: "critical",
      title: "Critical",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--red-main)" }}>{value}</span>;
      },
    },
    {
      key: "high",
      dataIndex: "high",
      title: "High",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--orange-main)" }}>{value}</span>;
      },
    },
    {
      key: "medium",
      dataIndex: "medium",
      title: "Medium",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--blue-main)" }}>{value}</span>;
      },
    },
    {
      key: "low",
      dataIndex: "low",
      title: "Low",
      align: "center",
      width: 70,
      render: (value: number) => {
        return <span style={{ color: "var(--green-main)" }}>{value}</span>;
      },
    },
    {
      key: "playtime",
      dataIndex: "playtime",
      title: "검사 소요 시간",
      width: 150,
      align: "center",
      render: () => {
        return <span>11분 18초</span>;
      },
    },
    {
      key: "creatorDateTime",
      dataIndex: "creatorDateTime",
      title: "검사일시",
      align: "center",
      width: 140,
      render: (creatorDateTime: string) => {
        return <span>{formatDateTimeSafely(creatorDateTime) ?? "-"}</span>;
      },
    },
    {
      key: "imageCount",
      dataIndex: "imageCount",
      title: "이미지 개수",
      align: "center",
      width: 80,
      render: () => {
        return <span>11</span>;
      },
    },
    creatorNameColumn,
  ];
};

export const createSecurityColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
