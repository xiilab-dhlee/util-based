"use client";

import { useQuery } from "@tanstack/react-query";

import { kubernetesMonitoringService } from "@/domain/kubernetes-monitoring/api/kubernetes-monitoring.service";
import { KUBERNETES_RESOURCE_LIST_PAGE_SIZE } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { kubernetesMonitoringKeys } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.key";
import type {
  DaemonsetListResponse,
  DeploymentListResponse,
  GetDaemonsetsPayload,
  GetDeploymentsPayload,
  GetNamespacesPayload,
  GetNodesPayload,
  GetPersistentVolumesPayload,
  GetPodsPayload,
  GetServicesPayload,
  GetStatefulsetsPayload,
  NamespaceListResponse,
  NodeListResponse,
  PersistentVolumeListResponse,
  PodListResponse,
  ServiceListResponse,
  StatefulsetListResponse,
} from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";

// ============================================================================
// 공통 파라미터 타입
// ============================================================================

interface BaseListParams {
  page: number;
  searchText?: string;
  enabled?: boolean;
}

// ============================================================================
// Nodes 훅
// ============================================================================

interface UseNodesListParams extends BaseListParams {
  status?: GetNodesPayload["status"];
}

/**
 * Nodes 목록 조회 훅
 */
export function useNodesList({
  page,
  searchText = "",
  status,
  enabled = true,
}: UseNodesListParams) {
  const payload: GetNodesPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
    ...(status && { status }),
  };

  return useQuery<NodeListResponse>({
    queryKey: kubernetesMonitoringKeys.nodesList(payload),
    queryFn: async () => {
      const response = await kubernetesMonitoringService.getNodes(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// Services 훅
// ============================================================================

interface UseServicesListParams extends BaseListParams {
  type?: GetServicesPayload["type"];
}

/**
 * Services 목록 조회 훅
 */
export function useServicesList({
  page,
  searchText = "",
  type,
  enabled = true,
}: UseServicesListParams) {
  const payload: GetServicesPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
    ...(type && { type }),
  };

  return useQuery<ServiceListResponse>({
    queryKey: kubernetesMonitoringKeys.servicesList(payload),
    queryFn: async () => {
      const response = await kubernetesMonitoringService.getServices(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// Daemonsets 훅
// ============================================================================

type UseDaemonsetsListParams = BaseListParams;

/**
 * Daemonsets 목록 조회 훅
 */
export function useDaemonsetsList({
  page,
  searchText = "",
  enabled = true,
}: UseDaemonsetsListParams) {
  const payload: GetDaemonsetsPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
  };

  return useQuery<DaemonsetListResponse>({
    queryKey: kubernetesMonitoringKeys.daemonsetsList(payload),
    queryFn: async () => {
      const response = await kubernetesMonitoringService.getDaemonsets(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// PersistentVolumes 훅
// ============================================================================

interface UsePersistentVolumesListParams extends BaseListParams {
  status?: GetPersistentVolumesPayload["status"];
}

/**
 * PersistentVolumes 목록 조회 훅
 */
export function usePersistentVolumesList({
  page,
  searchText = "",
  status,
  enabled = true,
}: UsePersistentVolumesListParams) {
  const payload: GetPersistentVolumesPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
    ...(status && { status }),
  };

  return useQuery<PersistentVolumeListResponse>({
    queryKey: kubernetesMonitoringKeys.persistentVolumesList(payload),
    queryFn: async () => {
      const response =
        await kubernetesMonitoringService.getPersistentVolumes(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// Namespaces 훅
// ============================================================================

interface UseNamespacesListParams extends BaseListParams {
  status?: GetNamespacesPayload["status"];
}

/**
 * Namespaces 목록 조회 훅
 */
export function useNamespacesList({
  page,
  searchText = "",
  status,
  enabled = true,
}: UseNamespacesListParams) {
  const payload: GetNamespacesPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
    ...(status && { status }),
  };

  return useQuery<NamespaceListResponse>({
    queryKey: kubernetesMonitoringKeys.namespacesList(payload),
    queryFn: async () => {
      const response = await kubernetesMonitoringService.getNamespaces(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// Deployments 훅
// ============================================================================

interface UseDeploymentsListParams extends BaseListParams {
  conditions?: GetDeploymentsPayload["conditions"];
}

/**
 * Deployments 목록 조회 훅
 */
export function useDeploymentsList({
  page,
  searchText = "",
  conditions,
  enabled = true,
}: UseDeploymentsListParams) {
  const payload: GetDeploymentsPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
    ...(conditions && { conditions }),
  };

  return useQuery<DeploymentListResponse>({
    queryKey: kubernetesMonitoringKeys.deploymentsList(payload),
    queryFn: async () => {
      const response =
        await kubernetesMonitoringService.getDeployments(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// Statefulsets 훅
// ============================================================================

type UseStatefulsetsListParams = BaseListParams;

/**
 * Statefulsets 목록 조회 훅
 */
export function useStatefulsetsList({
  page,
  searchText = "",
  enabled = true,
}: UseStatefulsetsListParams) {
  const payload: GetStatefulsetsPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
  };

  return useQuery<StatefulsetListResponse>({
    queryKey: kubernetesMonitoringKeys.statefulsetsList(payload),
    queryFn: async () => {
      const response =
        await kubernetesMonitoringService.getStatefulsets(payload);
      return response.data;
    },
    enabled,
  });
}

// ============================================================================
// Pods 훅
// ============================================================================

interface UsePodsListParams extends BaseListParams {
  status?: GetPodsPayload["status"];
}

/**
 * Pods 목록 조회 훅
 */
export function usePodsList({
  page,
  searchText = "",
  status,
  enabled = true,
}: UsePodsListParams) {
  const payload: GetPodsPayload = {
    page,
    size: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    searchText,
    ...(status && { status }),
  };

  return useQuery<PodListResponse>({
    queryKey: kubernetesMonitoringKeys.podsList(payload),
    queryFn: async () => {
      const response = await kubernetesMonitoringService.getPods(payload);
      return response.data;
    },
    enabled,
  });
}
