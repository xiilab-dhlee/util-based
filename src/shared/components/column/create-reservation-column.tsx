import type { ResponsiveColumnType } from "xiilab-ui";

import { REPORT_TYPE_LABEL } from "@/domain/report/constants/report.constant";
import { DeleteReservationButton } from "@/domain/report-reservation/components/delete-reservation-button";
import { ReservationScheduleSwitch } from "@/domain/report-reservation/components/reservation-schedule-switch";
import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { formatDispatchSchedule } from "@/domain/report-reservation/utils/report-reservation.util";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnTextButton,
} from "@/styles/layers/column-layer.styled";

interface CreateReservationColumnOptions {
  /** 리포트 이름 클릭 시 호출되는 콜백 */
  onReportNameClick?: (id: string) => void;
}

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (
  options?: CreateReservationColumnOptions,
): ResponsiveColumnType<ReservationListType>[] => {
  return [
    {
      title: "리포트 이름",
      key: "reportName",
      dataIndex: "reportName",
      align: "left",
      width: "20%",
      ellipsis: true,
      render: (reportName: string, record: ReservationListType) => {
        if (options?.onReportNameClick) {
          return (
            <ColumnTextButton
              onClick={() => options.onReportNameClick?.(record.id)}
            >
              {reportName}
            </ColumnTextButton>
          );
        }
        return reportName;
      },
    },
    {
      title: "리포트 종류",
      key: "reportType",
      dataIndex: "reportType",
      align: "center",
      render: (reportType: ReservationListType["reportType"]) => {
        return (
          <ColumnAlignCenterWrap>
            {REPORT_TYPE_LABEL[reportType] ?? "-"}
          </ColumnAlignCenterWrap>
        );
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
      title: "발송 주기",
      key: "dispatchCycle",
      dataIndex: "dispatchCycle",
      align: "center",
      render: (
        dispatchCycle: ReservationListType["dispatchCycle"],
        record: ReservationListType,
      ) => {
        return (
          <ColumnAlignCenterWrap>
            {formatDispatchSchedule(dispatchCycle, record.dispatchDay)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "종료일시",
      key: "endDateTime",
      dataIndex: "endDateTime",
      align: "center",
      render: (endDateTime: ReservationListType["endDateTime"]) => {
        return (
          <ColumnAlignCenterWrap>
            {formatDateTimeSafely(endDateTime)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "예약 발송",
      key: "isScheduled",
      dataIndex: "isScheduled",
      align: "center",
      render: (isScheduled: boolean, record: ReservationListType) => {
        return (
          <ColumnAlignCenterWrap>
            <ReservationScheduleSwitch
              id={record.id}
              isScheduled={isScheduled}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "삭제",
      key: "delete",
      dataIndex: "delete",
      align: "center",
      render: (_: unknown, record: ReservationListType) => {
        return (
          <ColumnAlignCenterWrap>
            <DeleteReservationButton id={record.id} />
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 예약 목록 테이블 컬럼 생성
 *
 * @param options 컬럼 옵션 (onReportNameClick 등)
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 모든 컬럼 표시 (기본)
 * const columns = createReservationColumn();
 *
 * @example
 * // 리포트 이름 클릭 핸들러 추가
 * const columns = createReservationColumn({
 *   onReportNameClick: (id) => console.log(id),
 * });
 *
 * @example
 * // 배열 형태 - 순서 변경 가능
 * const columns = createReservationColumn({}, [
 *   { key: 'reportName' },
 *   { key: 'reportType', width: 100 },
 * ]);
 */
export const createReservationColumn = (
  options?: CreateReservationColumnOptions,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<ReservationListType>[] => {
  const columnList = createColumnList(options);

  return applyColumnConfigs(columnList, config);
};
