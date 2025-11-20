import type { ResponsiveColumnType } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  ColumnAlignCenterWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "imageTag",
      title: "이미지 : 태그",
      align: "left",
      render: () => {
        return <ColumnLink href="#">Dev Snapshot-1 : v1.2</ColumnLink>;
      },
    },
    {
      dataIndex: "status",
      title: "검사 상태",
      align: "center",
      width: 70,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <Label variant="blue">완료</Label>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "total",
      title: "총 취약점 개수",
      align: "center",
      width: 90,
      render: () => {
        return <span>11개</span>;
      },
    },
    {
      dataIndex: "critical",
      title: "Critical",
      align: "center",
      width: 70,
      render: () => {
        return <span style={{ color: "var(--critical-text-color)" }}>11</span>;
      },
    },
    {
      dataIndex: "high",
      title: "High",
      align: "center",
      width: 70,
      render: () => {
        return <span style={{ color: "var(--high-text-color)" }}>11</span>;
      },
    },
    {
      dataIndex: "medium",
      title: "Medium",
      align: "center",
      width: 70,
      render: () => {
        return <span style={{ color: "var(--medium-text-color)" }}>11</span>;
      },
    },
    {
      dataIndex: "low",
      title: "Low",
      align: "center",
      width: 70,
      render: () => {
        return <span style={{ color: "var(--low-text-color)" }}>11</span>;
      },
    },
    {
      dataIndex: "playtime",
      title: "검사 소요 시간",
      width: 90,
      align: "center",
      render: () => {
        return <span>11분 18초</span>;
      },
    },
    {
      dataIndex: "imageCount",
      title: "이미지 개수",
      align: "center",
      width: 80,
      render: () => {
        return <span>11</span>;
      },
    },
  ];
};

export const createSecurityColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
