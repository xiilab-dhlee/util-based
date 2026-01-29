import type { ResponsiveColumnType } from "xiilab-ui";

import { DescribeButton } from "@/domain/kubernetes-monitoring/components/describe-button";
import { YamlLogButton } from "@/domain/kubernetes-monitoring/components/yaml-log-button";
import {
  getFieldDisplayValue,
  type KubernetesResourceName,
  RESOURCE_NAME_TO_TYPE,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import type { K8sResourceType } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const formatListOrDash = (items?: string[]): string => {
  if (!items || items.length === 0) {
    return "-";
  }

  return items.join(", ");
};

// 공통 액션 컬럼 (DESCRIBE, YAML) - 모든 리소스에서 재사용
const createActionColumns = (
  resourceType: K8sResourceType,
): ResponsiveColumnType[] => [
  {
    title: "Describe",
    key: "describe",
    align: "center",
    width: "5%",
    render: (_: unknown, record: { name: string }) => (
      <ColumnAlignCenterWrap>
        <DescribeButton resourceType={resourceType} name={record.name} />
      </ColumnAlignCenterWrap>
    ),
  },
  {
    title: "YAML",
    key: "yaml",
    align: "center",
    width: "5%",
    render: (_: unknown, record: { name: string }) => (
      <ColumnAlignCenterWrap>
        <YamlLogButton resourceType={resourceType} name={record.name} />
      </ColumnAlignCenterWrap>
    ),
  },
];

// Nodes 컬럼 정의
const createNodesColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "31%",
  },
  {
    title: "Role",
    key: "roles",
    dataIndex: "roles",
    align: "center",
    width: "20%",
    ellipsis: true,
    render: (roles: string[]) => formatListOrDash(roles),
  },
  {
    title: "GPU",
    key: "gpuName",
    dataIndex: "gpuName",
    align: "center",
    width: "24%",
    ellipsis: true,
    render: (gpuName?: string) => gpuName ?? "-",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "15%",
    ellipsis: true,
    render: (status: string) => getFieldDisplayValue("Nodes", status),
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Nodes),
];

// Service 컬럼 정의
const createServiceColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "28%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "28%",
  },
  {
    title: "Type",
    key: "type",
    dataIndex: "type",
    align: "center",
    width: "15%",
    ellipsis: true,
    render: (type: string) => getFieldDisplayValue("Service", type),
  },
  {
    title: "Ports",
    key: "ports",
    dataIndex: "ports",
    align: "center",
    width: "19%",
    ellipsis: true,
    render: (ports: string[]) => formatListOrDash(ports),
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Service),
];

// Daemonsets 컬럼 정의
const createDaemonsetsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "38%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "38%",
  },
  {
    title: "Pods",
    key: "pods",
    dataIndex: "pods",
    align: "center",
    width: "14%",
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Daemonsets),
];

// PersistentVolume 컬럼 정의
const createPersistentVolumeColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "39%",
  },
  {
    title: "StorageClass",
    key: "storageClass",
    dataIndex: "storageClass",
    align: "center",
    width: "32%",
    render: (storageClass?: string) => storageClass ?? "-",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "19%",
    render: (status: string) =>
      getFieldDisplayValue("PersistentVolume", status),
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.PersistentVolume),
];

// Namespaces 컬럼 정의
const createNamespacesColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "45%",
  },
  {
    title: "Age",
    key: "age",
    dataIndex: "age",
    align: "left",
    width: "26%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "19%",
    render: (status: string) => getFieldDisplayValue("Namespaces", status),
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Namespaces),
];

// Deployments 컬럼 정의
const createDeploymentsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "28%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "28%",
  },
  {
    title: "Pods",
    key: "pods",
    dataIndex: "pods",
    align: "center",
    width: "15%",
  },
  {
    title: "Conditions",
    key: "conditions",
    dataIndex: "conditions",
    align: "center",
    width: "19%",
    ellipsis: true,
    render: (conditions: string[]) => formatListOrDash(conditions),
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Deployments),
];

// Statefulsets 컬럼 정의
const createStatefulsetsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "38%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "38%",
  },
  {
    title: "Pods",
    key: "pods",
    dataIndex: "pods",
    align: "center",
    width: "14%",
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Statefulsets),
];

// Pods 컬럼 정의
const createPodsColumnList = (): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "27%",
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
    title: "Node",
    key: "node",
    dataIndex: "node",
    align: "left",
    ellipsis: true,
    width: "27%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "14%",
    render: (status: string) => getFieldDisplayValue("Pods", status),
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE.Pods),
];

// 기본 제네릭 컬럼 정의 (resourceName 파라미터 필요)
const createDefaultColumnList = (
  resourceName: KubernetesResourceName,
): ResponsiveColumnType[] => [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    align: "left",
    ellipsis: true,
    width: "28%",
  },
  {
    title: "Namespace",
    key: "namespace",
    dataIndex: "namespace",
    align: "left",
    ellipsis: true,
    width: "28%",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: "19%",
  },
  {
    title: "Created",
    key: "createdAt",
    dataIndex: "createdAt",
    align: "left",
    width: "15%",
    render: (createdAt: string) => {
      const formatted = formatDateTimeSafely(createdAt);
      return <ColumnAlignCenterWrap>{formatted}</ColumnAlignCenterWrap>;
    },
  },
  ...createActionColumns(RESOURCE_NAME_TO_TYPE[resourceName]),
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
      return createDefaultColumnList(resourceName);
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
