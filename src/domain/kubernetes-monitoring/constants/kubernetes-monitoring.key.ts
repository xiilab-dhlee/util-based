import type {
  GetDaemonsetsPayload,
  GetDeploymentsPayload,
  GetNamespacesPayload,
  GetNodesPayload,
  GetPersistentVolumesPayload,
  GetPodsPayload,
  GetServicesPayload,
  GetStatefulsetsPayload,
} from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";

/**
 * Kubernetes 모니터링 관련 React Query 키
 */
export const kubernetesMonitoringKeys = {
  default: ["kubernetesMonitoring"] as const,

  // Nodes
  nodes: () => [...kubernetesMonitoringKeys.default, "nodes"] as const,
  nodesList: (payload: GetNodesPayload) =>
    [...kubernetesMonitoringKeys.nodes(), "list", payload] as const,

  // Services
  services: () => [...kubernetesMonitoringKeys.default, "services"] as const,
  servicesList: (payload: GetServicesPayload) =>
    [...kubernetesMonitoringKeys.services(), "list", payload] as const,

  // Daemonsets
  daemonsets: () =>
    [...kubernetesMonitoringKeys.default, "daemonsets"] as const,
  daemonsetsList: (payload: GetDaemonsetsPayload) =>
    [...kubernetesMonitoringKeys.daemonsets(), "list", payload] as const,

  // PersistentVolumes
  persistentVolumes: () =>
    [...kubernetesMonitoringKeys.default, "persistentVolumes"] as const,
  persistentVolumesList: (payload: GetPersistentVolumesPayload) =>
    [...kubernetesMonitoringKeys.persistentVolumes(), "list", payload] as const,

  // Namespaces
  namespaces: () =>
    [...kubernetesMonitoringKeys.default, "namespaces"] as const,
  namespacesList: (payload: GetNamespacesPayload) =>
    [...kubernetesMonitoringKeys.namespaces(), "list", payload] as const,

  // Deployments
  deployments: () =>
    [...kubernetesMonitoringKeys.default, "deployments"] as const,
  deploymentsList: (payload: GetDeploymentsPayload) =>
    [...kubernetesMonitoringKeys.deployments(), "list", payload] as const,

  // Statefulsets
  statefulsets: () =>
    [...kubernetesMonitoringKeys.default, "statefulsets"] as const,
  statefulsetsList: (payload: GetStatefulsetsPayload) =>
    [...kubernetesMonitoringKeys.statefulsets(), "list", payload] as const,

  // Pods
  pods: () => [...kubernetesMonitoringKeys.default, "pods"] as const,
  podsList: (payload: GetPodsPayload) =>
    [...kubernetesMonitoringKeys.pods(), "list", payload] as const,
};
