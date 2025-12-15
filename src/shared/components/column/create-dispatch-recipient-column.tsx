import type { ResponsiveColumnType } from "xiilab-ui";

import {
  getTransmissionStatusLabel,
  TRANSMISSION_STATUS,
} from "@/domain/report-reservation/constants/report-reservation.constant";
import type { Recipient } from "@/domain/report-reservation/schemas/report-reservation.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  ColumnAlignCenterWrap,
  ColumnStatus,
} from "@/styles/layers/column-layer.styled";

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (): ResponsiveColumnType<Recipient>[] => {
  return [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      align: "left",
      ellipsis: true,
      width: "50%",
    },
    {
      title: "결과",
      dataIndex: "result",
      key: "result",
      align: "center",
      width: "25%",
      render: (result: Recipient["result"]) => {
        const statusClass =
          result === TRANSMISSION_STATUS.SUCCESS ? "success" : "failure";

        return (
          <ColumnAlignCenterWrap>
            <ColumnStatus className={statusClass}>
              {getTransmissionStatusLabel(result)}
            </ColumnStatus>
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 발송 내역 수신 목록 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 모든 컬럼 표시 (기본)
 * const columns = createDispatchRecipientColumn();
 */
export const createDispatchRecipientColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<Recipient>[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
