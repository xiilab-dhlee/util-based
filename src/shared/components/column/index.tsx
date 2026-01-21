import type { ResponsiveColumnType } from "xiilab-ui";

import { PreviewTag } from "@/shared/components/tag/preview-tag";
import {
  formatDateSafely,
  formatDateTimeSafely,
} from "@/shared/utils/date.util";
import { ColumnLabelWrap } from "@/styles/layers/column-layer.styled";

/**
 * 공통 컬럼: 라벨
 */
export const labelsColumn: ResponsiveColumnType = {
  key: "labels",
  dataIndex: "labels",
  title: "라벨",
  align: "left",
  render: (labels: string[]) => {
    return (
      <ColumnLabelWrap>
        <PreviewTag labels={labels} height={20} />
      </ColumnLabelWrap>
    );
  },
};

/**
 * 공통 컬럼: 생성자
 */
export const creatorNameColumn: ResponsiveColumnType = {
  key: "creatorName",
  dataIndex: "creatorName",
  title: "생성자",
  align: "center",
  render: (creatorName: string) => {
    return <span>{creatorName || "-"}</span>;
  },
};

/**
 * 공통 컬럼: 생성일
 */
export const creatorDateColumn: ResponsiveColumnType = {
  key: "creatorDate",
  dataIndex: "creatorDate",
  title: "생성일",
  align: "center",
  render: (creatorDate: string) => {
    return <span>{formatDateSafely(creatorDate)}</span>;
  },
};

/**
 * 공통 컬럼: 생성 일시
 */
export const creatorDateTimeColumn: ResponsiveColumnType = {
  key: "creatorDateTime",
  dataIndex: "creatorDateTime",
  title: "생성 일시",
  align: "left",
  render: (creatorDateTime: string) => {
    return <span>{formatDateTimeSafely(creatorDateTime)}</span>;
  },
};

export const createdAtColumn: ResponsiveColumnType = {
  key: "createdAt",
  dataIndex: "createdAt",
  title: "생성일",
  align: "left",
  render: (createdAt: string) => {
    return <span>{formatDateSafely(createdAt)}</span>;
  },
};

/**
 * 공통 컬럼: 수정일
 */
export const updatedAtColumn: ResponsiveColumnType = {
  key: "updatedAt",
  dataIndex: "updatedAt",
  title: "수정일",
  align: "center",
  render: (updatedAt: string) => {
    return <span>{formatDateSafely(updatedAt)}</span>;
  },
};
