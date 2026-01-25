"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";

import {
  useGetDaemonSets,
  useGetDeployments,
  useGetNamespaces,
  useGetNodes,
  useGetPersistentVolumes,
  useGetPods,
  useGetServices,
  useGetStatefulSets,
} from "@/api/generated/admin-k8s/admin-k8s";
import type {
  DaemonSetResponse,
  DeploymentResponse,
  NamespaceResponse,
  NodeResponse,
  PersistentVolumeResponse,
  PodResponse,
  ServiceResponse,
  StatefulSetResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  isNamespaceFilterStatus,
  isNodeFilterStatus,
  isPersistentVolumeFilterStatus,
  isPodFilterStatus,
  isServiceFilterType,
  kubernetesResourcePageAtom,
  kubernetesResourceSearchTextAtom,
  kubernetesResourceStatusAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { createKubernetesResourceColumn } from "@/domain/kubernetes-monitoring/components/create-kubernetes-resource-list-column";
import { KubernetesResourceListFilter } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-list-filter";
import { KubernetesResourceListFooter } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-list-footer";
import { KUBERNETES_RESOURCE_LIST_PAGE_SIZE } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

// ============================================================================
// 공통 타입 및 유틸리티
// ============================================================================

/**
 * 테이블용 고유 ID 생성 유틸리티
 */
function createDataSourceWithId<T extends { name: string }>(
  items: T[],
): (T & { id: string })[] {
  return items.map((item, index) => {
    const namespace =
      "namespace" in item ? (item as T & { namespace: string }).namespace : "";
    return {
      ...item,
      id: `${item.name}-${namespace}-${index}`,
    };
  });
}

// ============================================================================
// Nodes Section
// ============================================================================

export function NodesSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const filterValue = useAtomValue(kubernetesResourceStatusAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const nodeFilterStatus = isNodeFilterStatus(filterValue)
    ? filterValue
    : undefined;

  const { data, isLoading, isError } = useGetNodes({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    status: nodeFilterStatus,
  });

  const columns = useMemo(() => createKubernetesResourceColumn("Nodes"), []);
  const dataSource = createDataSourceWithId<NodeResponse>(data?.content ?? []);

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// Services Section
// ============================================================================

export function ServicesSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const filterValue = useAtomValue(kubernetesResourceStatusAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const serviceFilterType = isServiceFilterType(filterValue)
    ? filterValue
    : undefined;

  const { data, isLoading, isError } = useGetServices({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    type: serviceFilterType,
  });

  const columns = useMemo(() => createKubernetesResourceColumn("Service"), []);
  const dataSource = createDataSourceWithId<ServiceResponse>(
    data?.content ?? [],
  );

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// Daemonsets Section
// ============================================================================

export function DaemonsetsSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const { data, isLoading, isError } = useGetDaemonSets({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Daemonsets"),
    [],
  );
  const dataSource = createDataSourceWithId<DaemonSetResponse>(
    data?.content ?? [],
  );

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// PersistentVolumes Section
// ============================================================================

export function PersistentVolumesSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const filterValue = useAtomValue(kubernetesResourceStatusAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const pvFilterStatus = isPersistentVolumeFilterStatus(filterValue)
    ? filterValue
    : undefined;

  const { data, isLoading, isError } = useGetPersistentVolumes({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    status: pvFilterStatus,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("PersistentVolume"),
    [],
  );
  const dataSource = createDataSourceWithId<PersistentVolumeResponse>(
    data?.content ?? [],
  );

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// Namespaces Section
// ============================================================================

export function NamespacesSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const filterValue = useAtomValue(kubernetesResourceStatusAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const namespaceFilterStatus = isNamespaceFilterStatus(filterValue)
    ? filterValue
    : undefined;

  const { data, isLoading, isError } = useGetNamespaces({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    status: namespaceFilterStatus,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Namespaces"),
    [],
  );
  const dataSource = createDataSourceWithId<NamespaceResponse>(
    data?.content ?? [],
  );

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// Deployments Section
// ============================================================================

export function DeploymentsSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const { data, isLoading, isError } = useGetDeployments({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Deployments"),
    [],
  );
  const dataSource = createDataSourceWithId<DeploymentResponse>(
    data?.content ?? [],
  );

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// Statefulsets Section
// ============================================================================

export function StatefulsetsSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const { data, isLoading, isError } = useGetStatefulSets({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Statefulsets"),
    [],
  );
  const dataSource = createDataSourceWithId<StatefulSetResponse>(
    data?.content ?? [],
  );

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// Pods Section
// ============================================================================

export function PodsSection() {
  const page = useAtomValue(kubernetesResourcePageAtom);
  const searchText = useAtomValue(kubernetesResourceSearchTextAtom);
  const filterValue = useAtomValue(kubernetesResourceStatusAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const podFilterStatus = isPodFilterStatus(filterValue)
    ? filterValue
    : undefined;

  const { data, isLoading, isError } = useGetPods({
    pageNo: page - 1,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    status: podFilterStatus,
  });

  const columns = useMemo(() => createKubernetesResourceColumn("Pods"), []);
  const dataSource = createDataSourceWithId<PodResponse>(data?.content ?? []);

  return (
    <>
      <KubernetesResourceListFilter totalSize={data?.totalSize ?? 0} />
      <ListWrapper>
        <CustomizedTable
          loading={isLoading}
          isError={isError}
          columns={columns}
          data={dataSource}
          activePadding
          columnHeight={40}
          headerHeight={40}
        />
      </ListWrapper>
      <KubernetesResourceListFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
        onChange={setPage}
        isLoading={isLoading}
      />
    </>
  );
}
