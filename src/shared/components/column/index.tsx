import type { ResponsiveColumnType } from "xiilab-ui";

import { PreviewTag } from "@/shared/components/tag/preview-tag";
import { formatDateSafely } from "@/shared/utils/date.util";
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
      return <span>{formatDateSafely(creatorDate)}</span>;
    },
  },
  {
    dataIndex: "creatorDateTime",
    title: "생성 일시",
    align: "left",
    width: 140,
    render: (creatorDateTime: string) => {
      return <span>{formatDateSafely(creatorDateTime)}</span>;
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
          {formatDateSafely(updatedAt)}
        </ColumnAlignCenterWrap>
      );
    },
  },
];
