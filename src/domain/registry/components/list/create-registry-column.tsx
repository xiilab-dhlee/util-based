import type { ResponsiveColumnType } from "xiilab-ui";

import type {
  RegistryListResponse,
  RegistryListResponseImageSourceType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { createdAtColumn, creatorNameColumn } from "@/shared/components/column";
import { ROUTES } from "@/shared/constants/routes.constant";
import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

/**
 * mode에 따라 적절한 상세 페이지 경로를 반환
 */
const getDetailRoute = (
  mode: RegistryMode,
  harborImageName: string,
): string => {
  const encodedName = encodeURIComponent(harborImageName);
  return mode === "private"
    ? ROUTES.USER_PRIVATE_REGISTRY_DETAIL(encodedName)
    : ROUTES.USER_PUBLIC_REGISTRY_DETAIL(encodedName);
};

const createColumnList = (mode: RegistryMode): ResponsiveColumnType[] => {
  return [
    {
      key: "imageDisplayName",
      dataIndex: "imageDisplayName",
      title: "이미지 이름",
      align: "left",
      render: (imageDisplayName: string, record: RegistryListResponse) => {
        return (
          <ColumnLink
            href={getDetailRoute(mode, record.harborImageName)}
            data-testid={REGISTRY_SELECTOR.IMAGE_NAME}
          >
            {imageDisplayName || "-"}
          </ColumnLink>
        );
      },
    },
    {
      key: "imageSourceType",
      dataIndex: "imageSourceType",
      title: "구분",
      align: "center",
      render: (imageSourceType: RegistryListResponseImageSourceType) => {
        return (
          <span
            style={{ textTransform: "capitalize" }}
            data-testid={REGISTRY_SELECTOR.IMAGE_TYPE}
          >
            {imageSourceType?.toLowerCase() ?? "-"}
          </span>
        );
      },
    },
    {
      key: "recentImageTagAndCount",
      dataIndex: "recentImageTagAndCount",
      title: "최근 태그 / 개수",
      align: "center",
      render: (_: unknown, record: RegistryListResponse) => {
        return (
          <span>
            <span data-testid={REGISTRY_SELECTOR.RECENT_TAG}>
              {record.latestImageTagName || "-"}
            </span>
            &nbsp;/&nbsp;
            <span data-testid={REGISTRY_SELECTOR.TAG_COUNT}>
              {(record.imageTagCount || 0).toLocaleString()}개
            </span>
          </span>
        );
      },
    },
    {
      key: "downloadCount",
      dataIndex: "downloadCount",
      title: "다운로드 횟수",
      align: "center",
      render: (downloadCount: number) => {
        return (
          <span data-testid={REGISTRY_SELECTOR.DOWNLOAD_COUNT}>
            {(downloadCount || 0).toLocaleString()}번
          </span>
        );
      },
    },
    creatorNameColumn,
    createdAtColumn,
  ];
};

/**
 * 레지스트리 이미지 테이블 컬럼 생성
 *
 * @param mode 레지스트리 모드 (private | public)
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createRegistryColumn("private");
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createRegistryColumn("private", [
 *   { key: 'imageDisplayName' },
 *   { key: 'imageTagCount', width: 120 },
 *   { key: 'createdAt', title: '등록일' },
 * ]);
 */
export const createRegistryColumn = (
  mode: RegistryMode,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(mode);

  return applyColumnConfigs(columnList, config);
};
