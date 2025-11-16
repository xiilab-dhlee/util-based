import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import {
  ColumnAlignCenterWrap,
  ColumnTruncateText,
} from "../../styles/layers/column-layer.styled";
import { YamlLogButton } from "./yaml-log-button";

export const clusterResourceListColumn: ResponsiveColumnType[] = [
  {
    title: "리소스 명",
    dataIndex: "name",
    align: "left",
    render: (name: string) => {
      return <ColumnTruncateText width={60}>{name}</ColumnTruncateText>;
    },
  },
  {
    title: "Namespace",
    dataIndex: "namespace",
    align: "left",
    render: (name: string) => {
      return <ColumnTruncateText width={60}>{name}</ColumnTruncateText>;
    },
  },
  {
    title: "상태",
    dataIndex: "status",
    align: "left",
  },
  {
    title: "생성일",
    dataIndex: "creatorDate",
    align: "left",
    render: (creatorDate: string) => {
      return (
        <ColumnAlignCenterWrap>
          {format(creatorDate, "yyyy-MM-dd HH:mm:ss")}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "Describe",
    dataIndex: "none",
    align: "center",
    width: 70,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <YamlLogButton />
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "YAML",
    dataIndex: "none",
    align: "center",
    width: 60,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <YamlLogButton />
        </ColumnAlignCenterWrap>
      );
    },
  },
];
