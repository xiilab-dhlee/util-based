import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Tooltip } from "xiilab-ui";

import type { UserResourceSchemaType } from "@/domain/monitoring/schemas/user-resource.schema";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatNumber } from "@/shared/utils/format.util";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  ColumnAlignCenterWrap,
  ColumnTextButton,
} from "@/styles/layers/column-layer.styled";

const GPU_INFO = getResourceInfo("GPU");
const MIG_INFO = getResourceInfo("MIG");
const MPS_INFO = getResourceInfo("MPS");
const CPU_INFO = getResourceInfo("CPU");
const MEM_INFO = getResourceInfo("MEM");

/**
 * 사용자명(이메일) 포맷팅
 * - 사용자명만 있을 때: 사용자명
 * - 이메일만 있을 때: 이메일
 * - 둘 다 있을 때: 사용자명(이메일)
 * - 둘 다 없을 때: -
 */
const formatUserName = (record: UserResourceSchemaType): string => {
  const { userName, email } = record;

  if (userName && email) {
    return `${userName}(${email})`;
  }
  if (userName) {
    return userName;
  }
  if (email) {
    return email;
  }
  return "-";
};

/**
 * 리소스 값 포맷팅 (값이 없으면 "-" 반환, 천 단위 콤마 적용)
 */
const formatResourceValue = (
  value: number | null | undefined,
  unit: string,
) => {
  const formatted = formatNumber(value);
  return formatted === "-" ? formatted : `${formatted}${unit}`;
};

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "userName",
      dataIndex: "userName",
      title: "사용자",
      align: "left",
      sorter: true,
      defaultSortOrder: "ascend",
      render: (_: unknown, record: UserResourceSchemaType) => {
        const displayText = formatUserName(record);

        const handleClick = () => {
          pubsubUtil.publish(MONITORING_EVENTS.sendUserWorkspace, record);
        };

        return (
          <Tooltip title={displayText} maxWidth="100%">
            <EllipsisButton onClick={handleClick}>{displayText}</EllipsisButton>
          </Tooltip>
        );
      },
    },
    {
      key: "gpu",
      dataIndex: "gpu",
      title: GPU_INFO.text,
      align: "center",
      render: (gpu: number | null | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {formatResourceValue(gpu, GPU_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mig",
      dataIndex: "mig",
      title: MIG_INFO.text,
      align: "center",
      render: (mig: number | null | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {formatResourceValue(mig, MIG_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mps",
      dataIndex: "mps",
      title: MPS_INFO.text,
      align: "center",
      render: (mps: number | null | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {formatResourceValue(mps, MPS_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpu",
      dataIndex: "cpu",
      title: CPU_INFO.text,
      align: "center",
      render: (cpu: number | null | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {formatResourceValue(cpu, CPU_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mem",
      dataIndex: "mem",
      title: MEM_INFO.text,
      align: "center",
      render: (mem: number | null | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {formatResourceValue(mem, MEM_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 사용자별 리소스 점유율 테이블 컬럼 생성
 *
 * 사용자명 클릭 시 MONITORING_EVENTS.sendUserWorkspace 이벤트를 발행합니다.
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createUserResourceColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 및 옵션 변경 가능
 * const columns = createUserResourceColumn([
 *   { key: 'userName', width: 150, sorter: true },
 *   { key: 'gpu', width: 100 },
 *   { key: 'cpu', width: 100 },
 * ]);
 */
export const createUserResourceColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
const EllipsisButton = styled(ColumnTextButton)`
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;
