import type { ResponsiveColumnType } from "xiilab-ui";

import { DescribeButton } from "@/domain/kubernetes-monitoring/components/describe-button";
import { YamlLogButton } from "@/domain/kubernetes-monitoring/components/yaml-log-button";
import {
  getFieldDisplayValue,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

// 공통 액션 컬럼 (DESCRIBE, YAML) - 모든 리소스에서 재사용
const createActionColumns = (): ResponsiveColumnType[] => [
  {
    title: "Describe",
    key: "describe",
    dataIndex: "describe",
    align: "center",
    width: "5%",
    render: () => (
      <ColumnAlignCenterWrap>
        <DescribeButton />
      </ColumnAlignCenterWrap>
    ),
  },
  {
    title: "YAML",
    key: "yaml",
    dataIndex: "yaml",
    align: "center",
    width: "5%",
    render: () => (
      <ColumnAlignCenterWrap>
        <YamlLogButton />
      </ColumnAlignCenterWrap>
    ),
  },
];

// Nodes 컬럼 정의
const createNodesColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "35%",
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "role",
    align: "center",
    width: "12%",
  },
  {
    title: "GPU",
    key: "gpu",
    dataIndex: "gpu",
    align: "center",
    width: "12%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "12%",
    render: (status: string) => getFieldDisplayValue("Nodes", status),
  },
  ...createActionColumns(),
];

// Service 컬럼 정의
const createServiceColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Type",
    key: "type",
    dataIndex: "type",
    align: "center",
    width: "12%",
    render: (type: string) => getFieldDisplayValue("Service", type),
  },
  {
    title: "Ports",
    key: "ports",
    dataIndex: "ports",
    align: "center",
    width: "15%",
  },
  ...createActionColumns(),
];

// Daemonsets 컬럼 정의
const createDaemonsetsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "30%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "30%",
  },
  {
    title: "Pods",
    key: "pods",
    dataIndex: "pods",
    align: "center",
    width: "12%",
  },
  ...createActionColumns(),
];

// PersistentVolume 컬럼 정의
const createPersistentVolumeColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "30%",
  },
  {
    title: "StorageClass",
    key: "storageClass",
    dataIndex: "storageClass",
    align: "center",
    width: "25%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "15%",
    render: (status: string) =>
      getFieldDisplayValue("PersistentVolume", status),
  },
  ...createActionColumns(),
];

// Namespaces 컬럼 정의
const createNamespacesColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "35%",
  },
  {
    title: "Age",
    key: "age",
    dataIndex: "age",
    align: "left",
    width: "20%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "15%",
    render: (status: string) => getFieldDisplayValue("Namespaces", status),
  },
  ...createActionColumns(),
];

// Deployments 컬럼 정의
const createDeploymentsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Pods",
    key: "pods",
    dataIndex: "pods",
    align: "center",
    width: "12%",
  },
  {
    title: "Conditions",
    key: "conditions",
    dataIndex: "conditions",
    align: "center",
    width: "15%",
  },
  ...createActionColumns(),
];

// Statefulsets 컬럼 정의
const createStatefulsetsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "30%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "30%",
  },
  {
    title: "Pods",
    key: "pods",
    dataIndex: "pods",
    align: "center",
    width: "12%",
  },
  ...createActionColumns(),
];

// Pods 컬럼 정의
const createPodsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "18%",
  },
  {
    title: "Node",
    key: "node",
    dataIndex: "node",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "12%",
    render: (status: string) => getFieldDisplayValue("Pods", status),
  },
  ...createActionColumns(),
];

// 기본 제네릭 컬럼 정의
const createDefaultColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "resourceName",
    dataIndex: "resourceName",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "22%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "15%",
  },
  {
    title: "Created",
    key: "createDateTime",
    dataIndex: "createDateTime",
    align: "left",
    width: "12%",
    render: (createDateTime: Date) => {
      const formatted = formatDateTimeSafely(createDateTime);
      return <ColumnAlignCenterWrap>{formatted}</ColumnAlignCenterWrap>;
    },
  },
  ...createActionColumns(),
];

// 리소스명에 따라 컬럼 리스트를 반환하는 내부 함수
const getColumnListByResource = (
  resourceName: KubernetesResourceName,
): ResponsiveColumnType[] => {
  switch (resourceName) {
    case "Nodes":
      return createNodesColumnList();
    case "Service":
      return createServiceColumnList();
    case "Daemonsets":
      return createDaemonsetsColumnList();
    case "PersistentVolume":
      return createPersistentVolumeColumnList();
    case "Namespaces":
      return createNamespacesColumnList();
    case "Deployments":
      return createDeploymentsColumnList();
    case "Statefulsets":
      return createStatefulsetsColumnList();
    case "Pods":
      return createPodsColumnList();
    default:
      return createDefaultColumnList();
  }
};

/**
 * 쿠버네티스 리소스 목록 컬럼 생성
 *
 * @param resourceName 리소스 타입 이름
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열

 */
export const createKubernetesResourceColumn = (
  resourceName: KubernetesResourceName,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = getColumnListByResource(resourceName);

  return applyColumnConfigs(columnList, config);
};
