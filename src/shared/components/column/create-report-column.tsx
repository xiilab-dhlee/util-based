import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ResponsiveColumnType } from "xiilab-ui";

import {
  REPORT_DATE_TYPE_TEXT,
  REPORT_TYPE_LABEL,
} from "@/domain/report/constants/report.constant";
import type { ReportListType } from "@/domain/report/schemas/report.schema";
import { ROUTES } from "@/shared/constants/routes.constant";
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
const createColumnList = (
  router: AppRouterInstance,
): ResponsiveColumnType[] => {
  return [
    {
      title: "리포트 이름",
      key: "reportName",
      dataIndex: "reportName",
      align: "left",
      width: "30%",
      ellipsis: true,
      render: (reportName: string, record: ReportListType) => {
        const handleClick = () => {
          router.push(ROUTES.ADMIN_REPORT_DETAIL(String(record.id)));
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
      key: "reportDateType",
      dataIndex: "reportDateType",
      align: "center",
      render: (reportDateType: keyof typeof REPORT_DATE_TYPE_TEXT) => {
        return <span>{REPORT_DATE_TYPE_TEXT[reportDateType] ?? "-"}</span>;
      },
    },
    {
      title: "리포트 종류",
      key: "reportType",
      dataIndex: "reportType",
      align: "center",
      render: (reportType: keyof typeof REPORT_TYPE_LABEL) => {
        return <span>{REPORT_TYPE_LABEL[reportType] ?? "-"}</span>;
      },
    },
    {
      title: "기간",
      key: "period",
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
      key: "creator",
      dataIndex: "creator",
      align: "center",
    },
    {
      title: "생성 일시",
      key: "createdAt",
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
 * @param router Next.js router instance
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createReportColumn = (
  router: AppRouterInstance,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(router);

  return applyColumnConfigs(columnList, config);
};
