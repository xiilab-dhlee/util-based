import { faker } from "@faker-js/faker";

import {
  KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import type {
  AllResourceItem,
  DaemonsetResourceItem,
  DeploymentResourceItem,
  NamespaceResourceItem,
  NodeResourceItem,
  PersistentVolumeResourceItem,
  PodResourceItem,
  ServiceResourceItem,
  StatefulsetResourceItem,
} from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";

/**
 * Mock 풀 크기: 페이지당 15개 × 10페이지 = 150개
 */
const MOCK_POOL_SIZE = KUBERNETES_RESOURCE_LIST_PAGE_SIZE * 10;

/**
 * 1. Nodes 리소스 Mock 배열
 */
export const nodeResourceMocks: NodeResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => ({
    resourceName: `node-${i + 1}`,
    role: faker.helpers.arrayElement(["master", "worker"]),
    gpu: faker.helpers.arrayElement([
      "NVIDIA A100 (8)",
      "NVIDIA V100 (4)",
      "NVIDIA T4 (2)",
      "None",
    ]),
    status: faker.helpers.arrayElement(["Ready", "NotReady"]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }),
);

/**
 * 2. Service 리소스 Mock 배열
 */
export const serviceResourceMocks: ServiceResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => ({
    resourceName: `service-${i + 1}`,
    namespace: `namespace-${faker.number.int({ min: 1, max: 10 })}`,
    type: faker.helpers.arrayElement([
      "ClusterIP",
      "NodePort",
      "LoadBalancer",
      "ExternalName",
    ]),
    ports: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () =>
        `${faker.internet.port()}/${faker.helpers.arrayElement(["TCP", "UDP"])}`,
    ).join(", "),
    status: faker.helpers.arrayElement(["Running", "Pending", "Failed"]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }),
);

/**
 * 3. Daemonsets 리소스 Mock 배열
 */
export const daemonsetResourceMocks: DaemonsetResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => ({
    resourceName: `daemonset-${i + 1}`,
    namespace: `namespace-${faker.number.int({ min: 1, max: 10 })}`,
    pods: `${faker.number.int({ min: 1, max: 10 })}`,
    status: faker.helpers.arrayElement(["Running", "Pending", "Failed"]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }),
);

/**
 * 4. PersistentVolume 리소스 Mock 배열
 */
export const persistentVolumeResourceMocks: PersistentVolumeResourceItem[] =
  Array.from({ length: MOCK_POOL_SIZE }, (_, i) => ({
    resourceName: `pv-${i + 1}`,
    storageClass: faker.helpers.arrayElement([
      "standard",
      "fast-ssd",
      "slow-hdd",
    ]),
    status: faker.helpers.arrayElement([
      "Available",
      "Bound",
      "Released",
      "Failed",
    ]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }));

/**
 * 5. Namespaces 리소스 Mock 배열
 */
export const namespaceResourceMocks: NamespaceResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => {
    const value = faker.number.int({ min: 1, max: 365 });
    const unit = faker.helpers.arrayElement(["d", "h", "m"]);
    return {
      resourceName: `namespace-${i + 1}`,
      age: `${value}${unit}`,
      status: faker.helpers.arrayElement(["Active", "Terminating"]),
      createDateTime: faker.date.past({ years: 1 }).toISOString(),
    };
  },
);

/**
 * 6. Deployments 리소스 Mock 배열
 */
export const deploymentResourceMocks: DeploymentResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => ({
    resourceName: `deployment-${i + 1}`,
    namespace: `namespace-${faker.number.int({ min: 1, max: 10 })}`,
    pods: `${faker.number.int({ min: 1, max: 10 })}`,
    conditions: faker.helpers.arrayElement([
      "Available",
      "Progressing",
      "Degraded",
    ]),
    status: faker.helpers.arrayElement(["Running", "Pending", "Failed"]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }),
);

/**
 * 7. Statefulsets 리소스 Mock 배열
 */
export const statefulsetResourceMocks: StatefulsetResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => ({
    resourceName: `statefulset-${i + 1}`,
    namespace: `namespace-${faker.number.int({ min: 1, max: 10 })}`,
    pods: `${faker.number.int({ min: 1, max: 10 })}`,
    status: faker.helpers.arrayElement(["Running", "Pending", "Failed"]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }),
);

/**
 * 8. Pods 리소스 Mock 배열
 */
export const podResourceMocks: PodResourceItem[] = Array.from(
  { length: MOCK_POOL_SIZE },
  (_, i) => ({
    resourceName: `pod-${i + 1}`,
    namespace: `namespace-${faker.number.int({ min: 1, max: 10 })}`,
    node: `node-${faker.number.int({ min: 1, max: 20 })}`,
    status: faker.helpers.arrayElement([
      "Pending",
      "Running",
      "Succeeded",
      "Failed",
      "Unknown",
    ]),
    createDateTime: faker.date.past({ years: 1 }).toISOString(),
  }),
);

/**
 * 리소스 타입별 Mock 데이터 조회
 */
export function getResourceMocks(
  resourceName: KubernetesResourceName,
): AllResourceItem[] {
  switch (resourceName) {
    case "Nodes":
      return nodeResourceMocks;
    case "Service":
      return serviceResourceMocks;
    case "Daemonsets":
      return daemonsetResourceMocks;
    case "PersistentVolume":
      return persistentVolumeResourceMocks;
    case "Namespaces":
      return namespaceResourceMocks;
    case "Deployments":
      return deploymentResourceMocks;
    case "Statefulsets":
      return statefulsetResourceMocks;
    case "Pods":
      return podResourceMocks;
    default:
      return [];
  }
}
