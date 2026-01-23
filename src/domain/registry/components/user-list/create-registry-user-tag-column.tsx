import type { ResponsiveColumnType } from "xiilab-ui";

import type {
  AccountImageTagResponse,
  AccountImageTagResponseImageType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

/** 이미지 타입 텍스트 매핑 */
const IMAGE_TYPE_TEXT: Record<AccountImageTagResponseImageType, string> = {
  BUILT_IN: "Built-in",
  HUB: "Hub",
  PRIVATE: "Private",
  PUBLIC: "Public",
};

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "imageDisplayName",
      dataIndex: "imageDisplayName",
      title: "이미지명",
      align: "left",
      render: (imageDisplayName: string) => {
        return <span>{imageDisplayName || "-"}</span>;
      },
    },
    {
      key: "tagName",
      dataIndex: "tagName",
      title: "태그",
      align: "left",
      render: (tagName: string) => {
        return <span>{tagName || "-"}</span>;
      },
    },
    {
      key: "workspaceName",
      dataIndex: "workspaceName",
      title: "워크스페이스",
      align: "center",
      render: (workspaceName?: string) => {
        return <span>{workspaceName || "-"}</span>;
      },
    },
    {
      key: "imageType",
      dataIndex: "imageType",
      title: "타입",
      align: "center",
      render: (imageType?: AccountImageTagResponseImageType) => {
        return <span>{imageType ? IMAGE_TYPE_TEXT[imageType] : "-"}</span>;
      },
    },
    {
      key: "sizeByte",
      dataIndex: "sizeByte",
      title: "크기",
      align: "center",
      render: (sizeByte?: number) => {
        if (sizeByte === undefined || sizeByte === null) {
          return <span>-</span>;
        }
        return <span>{formatFileSize(sizeByte).formatted}</span>;
      },
    },
    {
      key: "uploadedAt",
      dataIndex: "uploadedAt",
      title: "업로드 일시",
      align: "center",
      render: (uploadedAt?: string) => {
        return <span>{formatDateTimeSafely(uploadedAt)}</span>;
      },
    },
  ];
};

/**
 * 사용자별 이미지 태그 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createRegistryUserTagColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<AccountImageTagResponse>[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
