import type { ResponsiveColumnType } from "xiilab-ui";

import type { ReportListType } from "@/domain/report/schemas/report.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  formatDateSafely,
  formatDateTimeSafely,
} from "@/shared/utils/date.util";
import { ColumnTextButton } from "@/styles/layers/column-layer.styled";

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "리포트 이름",
      dataIndex: "reportName",
      align: "left",
      width: "30%",
      ellipsis: true,
      render: (reportName: string, record: ReportListType) => {
        const handleClick = () => {
          // TODO: 상세 페이지 이동 (추후 구현)
          console.log("Report detail:", record.id);
        };
        return (
          <ColumnTextButton onClick={handleClick}>
            {reportName}
          </ColumnTextButton>
        );
      },
    },
    {
      title: "리포트 타입",
      dataIndex: "reportDateType",
      align: "center",
      render: (reportDateType: string) => {
        return <span>{reportDateType === "WEEKLY" ? "주간" : "월간"}</span>;
      },
    },
    {
      title: "리포트 종류",
      dataIndex: "reportType",
      align: "center",
      render: (reportType: string) => {
        return <span>{reportType === "SYSTEM" ? "시스템" : "클러스터"}</span>;
      },
    },
    {
      title: "기간",
      dataIndex: "period",
      align: "center",
      render: (_, record: ReportListType) => {
        return (
          <span>
            {formatDateSafely(record.startDate)} ~{" "}
            {formatDateSafely(record.endDate)}
          </span>
        );
      },
    },
    {
      title: "생성자",
      dataIndex: "creator",
      align: "center",
    },
    {
      title: "생성 일시",
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt: string) => {
        return <span>{formatDateTimeSafely(createdAt)}</span>;
      },
    },
  ];
};

/**
 * 리포트 목록 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createReportColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
