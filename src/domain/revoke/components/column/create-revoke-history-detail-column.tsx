import type { ResponsiveColumnType } from "xiilab-ui";
import { Label } from "xiilab-ui";

import { REVOKE_HISTORY_DETAIL_TYPE } from "@/domain/revoke/constants/revoke-history.constant";
import type { RevokeHistoryDetailItemType } from "@/domain/revoke/types/revoke-history.type";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

/**
 * 리소스 회수 이력 상세 (경고/회수 목록) 테이블 컬럼 생성
 *
 * 백엔드 API에서 일부 필드는 추후 추가될 예정이므로,
 * 현재는 해당 필드들이 undefined일 수 있습니다.
 *
 * @returns 컬럼 배열
 */
export function createRevokeHistoryDetailColumn(): ResponsiveColumnType<RevokeHistoryDetailItemType>[] {
  return [
    {
      title: "워크로드 이름",
      dataIndex: "workloadName",
      align: "center",
      render: (workloadName) => <span>{workloadName ?? "-"}</span>,
    },
    {
      title: "구분",
      dataIndex: "type",
      align: "center",
      render: (type) => {
        if (!type) return <span>-</span>;
        return (
          <Label
            variant={
              type === REVOKE_HISTORY_DETAIL_TYPE.WARNING ? "blue" : "red"
            }
          >
            {type === REVOKE_HISTORY_DETAIL_TYPE.WARNING ? "경고" : "회수"}
          </Label>
        );
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
      dataIndex: "jobType",
      align: "center",
      render: (jobType) => <span>{jobType ?? "-"}</span>,
    },
    {
      title: "GPU(%)",
      dataIndex: "gpu",
      align: "center",
      render: (gpu) => <span>{gpu != null ? `${gpu}%` : "-"}</span>,
    },
    {
      title: "CPU(%)",
      dataIndex: "cpu",
      align: "center",
      render: (cpu) => <span>{cpu != null ? `${cpu}%` : "-"}</span>,
    },
    {
      title: "Memory(%)",
      dataIndex: "memory",
      align: "center",
      render: (memory) => <span>{memory != null ? `${memory}%` : "-"}</span>,
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
      render: (createdAt) => (
        <span>{formatDateTimeSafely(createdAt) ?? "-"}</span>
      ),
    },
  ];
}
