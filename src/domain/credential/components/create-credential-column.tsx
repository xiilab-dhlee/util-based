import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminCredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getCredentialTypeInfo } from "@/domain/credential/constants/credential.constant";
import { CredentialDeleteButton } from "@/domain/system-setting/components/credential-delete-button";
import { CredentialNameButton } from "@/domain/system-setting/components/credential-name-button";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "크리덴셜 이름",
      dataIndex: "credentialName",
      key: "credentialName",
      align: "left",
      ellipsis: true,
      render: (_: string, record: AdminCredentialListItemResponse) => (
        <CredentialNameButton {...record} />
      ),
    },
    {
      title: "타입",
      dataIndex: "credentialType",
      key: "credentialType",
      align: "left",
      render: (type: string) => getCredentialTypeInfo(type).label,
    },

    {
      title: "생성자",
      dataIndex: "creatorName",
      key: "creatorName",
      align: "left",
    },
    {
      title: "생성일",
      dataIndex: "createDateTime",
      key: "createDateTime",
      align: "left",
      render: (date: string) => {
        return formatDateSafely(date);
      },
    },
    {
      title: "삭제",
      key: "delete",
      align: "center",
      render: (_: unknown, record: AdminCredentialListItemResponse) => (
        <CredentialDeleteButton {...record} />
      ),
    },
  ];
};

/**
 * 크리덴셜 목록 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createCredentialColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createCredentialColumn([
 *   { key: 'credentialName' },
 *   { key: 'credentialChannel', width: 120 },
 *   { key: 'createDateTime', title: '등록일' },
 * ]);
 */
export const createCredentialColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
