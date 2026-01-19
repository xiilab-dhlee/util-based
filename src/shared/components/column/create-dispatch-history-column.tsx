import type { ResponsiveColumnType } from "xiilab-ui";

import {
  getTransmissionStatusLabel,
  TRANSMISSION_STATUS,
} from "@/domain/report-reservation/constants/report-reservation.constant";
import type { DispatchHistoryType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnStatus,
  ColumnTextButton,
} from "@/styles/layers/column-layer.styled";

export interface CreateDispatchHistoryColumnOptions {
  /** 리포트 이름 클릭 시 호출되는 콜백 */
  onReportNameClick?: (id: string) => void;
}

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (
  options?: CreateDispatchHistoryColumnOptions,
): ResponsiveColumnType<DispatchHistoryType>[] => {
  return [
    {
      title: "리포트 이름",
      key: "reportName",
      dataIndex: "reportName",
      align: "left",
      width: "30%",
      ellipsis: true,
      render: (reportName: string, record: DispatchHistoryType) => {
        if (options?.onReportNameClick) {
          return (
            <ColumnTextButton
              onClick={(e) => {
                e.stopPropagation();
                options.onReportNameClick?.(record.id);
              }}
            >
              {reportName}
            </ColumnTextButton>
          );
        }
        return reportName;
      },
    },
    {
      title: "수신자 수",
      key: "recipientCount",
      dataIndex: "recipientCount",
      align: "center",
      render: (recipientCount: number) => {
        return (
          <ColumnAlignCenterWrap>{recipientCount}명</ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "전송상태",
      key: "transmissionStatus",
      dataIndex: "transmissionStatus",
      align: "center",
      render: (
        transmissionStatus: DispatchHistoryType["transmissionStatus"],
      ) => {
        const statusClass =
          transmissionStatus === TRANSMISSION_STATUS.SUCCESS
            ? "success"
            : "failure";

        return (
          <ColumnAlignCenterWrap>
            <ColumnStatus className={statusClass}>
              {getTransmissionStatusLabel(transmissionStatus)}
            </ColumnStatus>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "발송일시",
      key: "dispatchDateTime",
      dataIndex: "dispatchDateTime",
      align: "center",
      render: (dispatchDateTime: string) => {
        return (
          <ColumnAlignCenterWrap>
            {formatDateTimeSafely(dispatchDateTime)}
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 발송 내역 목록 테이블 컬럼 생성
 *
 * @param options 컬럼 옵션 (onReportNameClick 등)
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 리포트 이름 클릭 핸들러 추가
 * const columns = createDispatchHistoryColumn({
 *   onReportNameClick: (id) => router.push(`/report-reservation/${id}`),
 * });
 */
export const createDispatchHistoryColumn = (
  options?: CreateDispatchHistoryColumnOptions,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<DispatchHistoryType>[] => {
  const columnList = createColumnList(options);

  return applyColumnConfigs(columnList, config);
};
