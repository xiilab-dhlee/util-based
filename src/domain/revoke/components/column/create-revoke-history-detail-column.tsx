import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";

import {
  getRevokeJobTypeLabel,
  REVOKE_HISTORY_DETAIL_LABEL,
  REVOKE_HISTORY_DETAIL_TYPE,
  type RevokeHistoryDetailSortState,
} from "@/domain/revoke/constants/revoke-history.constant";
import type { RevokeHistoryDetailItemType } from "@/domain/revoke/types/revoke-history.type";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import { errorTextStyle } from "@/styles/mixins/text";

/**
 * 리소스 회수 이력 상세 (경고/회수 목록) 테이블 컬럼 생성
 *
 * 백엔드 API에서 일부 필드는 추후 추가될 예정이므로,
 * 현재는 해당 필드들이 undefined일 수 있습니다.
 *
 * @param sort - 정렬 상태
 * @returns 컬럼 배열
 */
export function createRevokeHistoryDetailColumn(
  sort: RevokeHistoryDetailSortState,
): ResponsiveColumnType<RevokeHistoryDetailItemType>[] {
  return [
    {
      title: "워크로드 이름",
      dataIndex: "workloadName",
      align: "center",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "workloadName"),
      render: (workloadName) => <span>{workloadName ?? "-"}</span>,
    },
    {
      title: "구분",
      dataIndex: "reclaimStatus",
      align: "center",
      render: (type) => {
        if (!type) return <span>-</span>;
        if (type === REVOKE_HISTORY_DETAIL_TYPE.WARNING) {
          return (
            <StatusText $isError={false}>
              {REVOKE_HISTORY_DETAIL_LABEL.WARNING}
            </StatusText>
          );
        }
        if (type === REVOKE_HISTORY_DETAIL_TYPE.RECLAIMED) {
          return (
            <StatusText $isError>
              {REVOKE_HISTORY_DETAIL_LABEL.RECLAIMED}
            </StatusText>
          );
        }
        return <span>-</span>;
      },
    },
    {
      title: "워크스페이스",
      dataIndex: "workspaceName",
      align: "center",
      render: (workspaceName) => <span>{workspaceName ?? "-"}</span>,
    },
    {
      title: "Job Type",
      dataIndex: "workloadJobType",
      align: "center",
      render: (workloadJobType) => (
        <span>
          {workloadJobType ? getRevokeJobTypeLabel(workloadJobType) : "-"}
        </span>
      ),
    },
    {
      title: "GPU(%)",
      dataIndex: "gpu",
      align: "center",
      render: (gpu) => <span>{formatNumberWithUnit(gpu, "%")}</span>,
    },
    {
      title: "CPU(%)",
      dataIndex: "cpu",
      align: "center",
      render: (cpu) => <span>{formatNumberWithUnit(cpu, "%")}</span>,
    },
    {
      title: "Memory(%)",
      dataIndex: "memory",
      align: "center",
      render: (memory) => <span>{formatNumberWithUnit(memory, "%")}</span>,
    },
    {
      title: "생성자",
      dataIndex: "creatorName",
      align: "center",
      render: (creatorName) => <span>{creatorName ?? "-"}</span>,
    },
    {
      title: "생성 일시",
      dataIndex: "createdAt",
      align: "center",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt) => <span>{formatDateTimeSafely(createdAt)}</span>,
    },
  ];
}

const StatusText = styled.span<{ $isError: boolean }>`
  ${({ $isError }) => ($isError ? errorTextStyle : null)}
`;
