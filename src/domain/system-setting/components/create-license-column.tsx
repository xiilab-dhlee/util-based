import type { ResponsiveColumnType } from "xiilab-ui";

import type { LicenseListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 라이선스 등록 이력 컬럼 정의
 */
const createColumnList = (): ResponsiveColumnType<LicenseListResponse>[] => {
  return [
    {
      title: "등록일시",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "left",
      width: "40%",
      render: (date: string) => {
        return formatDateSafely(date, "yyyy.MM.dd HH:mm", "-");
      },
    },
    {
      title: "만료기간",
      key: "expiredAt",
      dataIndex: "expiredAt",
      align: "left",
      width: "30%",
      render: (date: string) => {
        return formatDateSafely(date, "yyyy.MM.dd", "-");
      },
    },
    {
      title: "GPU 개수",
      key: "gpuCount",
      dataIndex: "gpuCount",
      align: "left",
      width: "30%",
      render: (count: number) => {
        return `${formatNumberWithUnit(count, getResourceInfo("GPU").unit)}`;
      },
    },
  ];
};

/**
 * 라이선스 등록 이력 컬럼 생성 함수
 * @param config 컬럼 설정 배열
 * @returns 컬럼 정의 배열
 */
export const createLicenseColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<LicenseListResponse>[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
