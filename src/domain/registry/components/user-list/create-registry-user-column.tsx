import type { ResponsiveColumnType } from "xiilab-ui";

import type { PrivateImageUsageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatFileSize } from "@/shared/utils/file.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "accountName",
      dataIndex: "accountName",
      title: "사용자 이름",
      align: "left",
      render: (accountName: string, record: PrivateImageUsageResponse) => {
        const name = accountName || "-";
        const email = record.email;
        const userName = email ? `${name}(${email})` : name;
        return <span>{userName}</span>;
      },
    },
    {
      key: "imageCount",
      dataIndex: "imageCount",
      title: "컨테이너 이미지 개수",
      align: "center",
      render: (imageCount: number) => {
        return <span>{(imageCount || 0).toLocaleString()}개</span>;
      },
    },
    {
      key: "usedStorage",
      dataIndex: "usedStorage",
      title: "스토리지 사용 용량",
      align: "center",
      render: (usedStorage: number) => {
        return <span>{formatFileSize(usedStorage).formatted}</span>;
      },
    },
  ];
};

/**
 * 레지스트리 사용자별 이미지 등록 현황 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createRegistryUserColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<PrivateImageUsageResponse>[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
