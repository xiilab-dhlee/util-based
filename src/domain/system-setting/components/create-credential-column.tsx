import type { ResponsiveColumnType } from "xiilab-ui";
import { Button } from "xiilab-ui";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { ColumnTextButton } from "@/styles/layers/column-layer.styled";

interface CreateCredentialColumnOptions {
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  onNameClick?: (id: number) => void;
}

/**
 * 크리덴셜 목록 컬럼 정의
 */
const createColumnList = (
  options?: CreateCredentialColumnOptions,
): ResponsiveColumnType<CredentialListType>[] => {
  const columns: ResponsiveColumnType<CredentialListType>[] = [
    {
      title: "크리덴셜 이름",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "30%",
      ellipsis: true,
      render: (name: string, record: CredentialListType) => (
        <ColumnTextButton
          onClick={(e) => {
            e.stopPropagation();
            options?.onNameClick?.(record.id);
          }}
        >
          {name}
        </ColumnTextButton>
      ),
    },
    {
      title: "타입",
      dataIndex: "type",
      key: "type",
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
      dataIndex: "creatorDate",
      key: "creatorDate",
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
      render: (_: unknown, record: CredentialListType) => (
        <Button
          variant="text"
          size="small"
          onClick={() => options.onDelete?.(record.id)}
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
): ResponsiveColumnType<CredentialListType>[] => {
  const columnList = createColumnList(options);

  return applyColumnConfigs(columnList, config);
};
