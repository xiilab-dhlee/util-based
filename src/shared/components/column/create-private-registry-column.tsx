import type { ResponsiveColumnType } from "xiilab-ui";

import type { RegistryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "imageDisplayName",
      title: "이미지 이름",
      align: "left",
      render: (imageDisplayName: string) => {
        return <span>{imageDisplayName}</span>;
      },
    },
    {
      dataIndex: "imageType",
      title: "구분",
      width: 100,
      align: "center",
      render: () => {
        return <span>구분?</span>;
      },
    },
    {
      dataIndex: "imageTagCount",
      title: "태그 수",
      width: 100,
      align: "center",
      render: (imageTagCount: number) => {
        return <span>{imageTagCount}</span>;
      },
    },
    {
      dataIndex: "recentImageTagAndCount",
      title: "최근 태그 / 개수",
      width: 100,
      align: "center",
      render: (_: unknown, record: RegistryListResponse) => {
        return (
          <span>
            {record.latestImageTagName || "-"} /&nbsp;
            {(record.imageTagCount || 0).toLocaleString()}개
          </span>
        );
      },
    },
    {
      dataIndex: "downloadCount",
      title: "다운로드 수",
      width: 100,
      align: "center",
      render: (downloadCount: number) => {
        return <span>{(downloadCount || 0).toLocaleString()}번</span>;
      },
    },
  ];
};

/**
 * 프라이빗 레지스트리 이미지 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createPrivateRegistryColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createPrivateRegistryColumn([
 *   { dataIndex: 'imageDisplayName' },
 *   { dataIndex: 'imageTagCount', width: 120 },
 *   { dataIndex: 'createdAt', title: '등록일' },
 * ]);
 */
export const createPrivateRegistryColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
