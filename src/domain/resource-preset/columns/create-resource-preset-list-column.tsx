import type { ResponsiveColumnType } from "xiilab-ui";

import type { ResourcePresetListType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import { ROUTES } from "@/shared/constants/routes.constant";
import { formatDateSafely } from "@/shared/utils/date.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

const gpuInfo = getResourceInfo("GPU");
const cpuInfo = getResourceInfo("CPU");
const memInfo = getResourceInfo("MEM");

/**
 * 리소스 프리셋 목록 테이블 컬럼 정의
 *
 * 선택(체크박스) 컬럼은 Ant Design Table의 rowSelection 기능을 사용하여 처리하고,
 * 이 컬럼 정의에서는 도메인 데이터 컬럼만 관리합니다.
 */
export const resourcePresetListColumn: ResponsiveColumnType<ResourcePresetListType>[] =
  [
    {
      title: "프리셋 이름",
      dataIndex: "name",
      align: "left",
      sorter: true,
      width: "40%",
      ellipsis: true,
      render: (name: string, record: ResourcePresetListType) => {
        const href = ROUTES.ADMIN_RESOURCE_PRESET_DETAIL(record.id);
        return <ColumnLink href={href}>{name}</ColumnLink>;
      },
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
      align: "left",
    },
    {
      title: "Node Type",
      dataIndex: "nodeType",
      align: "left",
    },
    {
      title: gpuInfo.text,
      dataIndex: "gpu",
      align: "left",
      render: (gpu: ResourcePresetListType["gpu"]) => {
        return `${gpu} ${gpuInfo.unit}`;
      },
    },
    {
      title: cpuInfo.text,
      dataIndex: "cpu",
      align: "left",

      render: (cpu: ResourcePresetListType["cpu"]) => {
        return `${cpu} ${cpuInfo.unit}`;
      },
    },
    {
      title: memInfo.text,
      dataIndex: "memory",
      align: "left",

      render: (memory: ResourcePresetListType["memory"]) => {
        return `${memory} ${memInfo.unit}`;
      },
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
      align: "left",

      sorter: true,
      render: (createdAt: ResourcePresetListType["createdAt"]) => {
        return formatDateSafely(createdAt) ?? "-";
      },
    },
  ];
