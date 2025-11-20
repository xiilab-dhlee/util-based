import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { PreviewTag } from "@/shared/components/tag/preview-tag";
import {
  ColumnAlignCenterWrap,
  ColumnLabelWrap,
} from "@/styles/layers/column-layer.styled";

export const commonColumns: ResponsiveColumnType[] = [
  {
    dataIndex: "labels",
    title: "라벨",
    align: "left",
    width: 140,
    render: (labels: string[]) => {
      return (
        <ColumnLabelWrap>
          <PreviewTag labels={labels} height={20} />
        </ColumnLabelWrap>
      );
    },
  },
  {
    dataIndex: "creatorName",
    title: "생성자",
    align: "center",
  },
  {
    dataIndex: "creatorDate",
    title: "생성일",
    align: "center",
    width: 140,
    render: (creatorDate: string) => {
      return (
        <ColumnAlignCenterWrap>
          {format(creatorDate, "yyyy.MM.dd")}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    dataIndex: "creatorDateTime",
    title: "생성 일시",
    align: "left",
    width: 140,
    render: (creatorDateTime: string) => {
      return <span>{format(creatorDateTime, "yyyy.MM.dd HH:mm:ss")}</span>;
    },
  },
  {
    dataIndex: "updatedAt",
    title: "수정일",
    align: "center",
    width: 140,
    render: (updatedAt: string) => {
      return (
        <ColumnAlignCenterWrap>
          {format(updatedAt, "yyyy.MM.dd")}
        </ColumnAlignCenterWrap>
      );
    },
  },
];
