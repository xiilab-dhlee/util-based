import type { ResponsiveColumnType } from "xiilab-ui";

import type { LicenseDetailType } from "@/domain/system-setting/schemas/license.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 라이선스 등록 이력 컬럼 정의
 */
const createColumnList = (): ResponsiveColumnType<LicenseDetailType>[] => {
  return [
    {
      title: "등록일시",
      key: "registrationDate",
      dataIndex: "registrationDate",
      align: "left",
      width: "40%",
      render: (date: string) => {
        return formatDateSafely(date, "yyyy.MM.dd HH:mm", "-");
      },
    },
    {
      title: "만료기간",
      key: "expirationDate",
      dataIndex: "expirationDate",
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
        return `${count}${getResourceInfo("GPU").unit}`;
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
): ResponsiveColumnType<LicenseDetailType>[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
