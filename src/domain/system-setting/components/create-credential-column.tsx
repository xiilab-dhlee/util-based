import type { ResponsiveColumnType } from "xiilab-ui";
import { Button } from "xiilab-ui";

import type { AdminCredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { ColumnTextButton } from "@/styles/layers/column-layer.styled";

interface CreateCredentialColumnOptions {
  onDelete?: (accountId: string, credentialId: number) => void;
  isDeleting?: boolean;
  onNameClick?: (accountId: string, credentialId: number) => void;
}

/**
 * 크리덴셜 목록 컬럼 정의
 *
 * Orval의 AdminCredentialListItemResponse 타입을 사용합니다.
 */
const createColumnList = (
  options?: CreateCredentialColumnOptions,
): ResponsiveColumnType<AdminCredentialListItemResponse>[] => {
  const columns: ResponsiveColumnType<AdminCredentialListItemResponse>[] = [
    {
      title: "크리덴셜 이름",
      dataIndex: "credentialName",
      key: "credentialName",
      align: "left",
      width: "30%",
      ellipsis: true,
      render: (name: string, record: AdminCredentialListItemResponse) => (
        <ColumnTextButton
          onClick={(e) => {
            e.stopPropagation();
            options?.onNameClick?.(record.creatorId, record.credentialId);
          }}
        >
          {name}
        </ColumnTextButton>
      ),
    },
    {
      title: "채널",
      dataIndex: "credentialChannel",
      key: "credentialChannel",
      align: "left",
      width: "15%",
    },
    {
      title: "생성자",
      dataIndex: "creatorName",
      key: "creatorName",
      align: "left",
      width: "25%",
    },
    {
      title: "생성일",
      dataIndex: "createDateTime",
      key: "createDateTime",
      align: "left",
      width: "20%",
      render: (date: string) => {
        return formatDateSafely(date, "yyyy.MM.dd", "-");
      },
    },
  ];

  if (options?.onDelete) {
    columns.push({
      title: "삭제",
      key: "actions",
      align: "center",
      width: "10%",
      render: (_: unknown, record: AdminCredentialListItemResponse) => (
        <Button
          variant="text"
          size="small"
          onClick={() =>
            options.onDelete?.(record.creatorId, record.credentialId)
          }
          disabled={options.isDeleting}
          icon="Delete"
        />
      ),
    });
  }

  return columns;
};

/**
 * 크리덴셜 목록 컬럼 생성 함수
 * @param config 컬럼 설정 배열
 * @param options 삭제 핸들러 및 로딩 상태
 * @returns 컬럼 정의 배열
 */
export const createCredentialColumn = (
  config?: CoreCreateColumnConfig[],
  options?: CreateCredentialColumnOptions,
): ResponsiveColumnType<AdminCredentialListItemResponse>[] => {
  const columnList = createColumnList(options);

  return applyColumnConfigs(columnList, config);
};
