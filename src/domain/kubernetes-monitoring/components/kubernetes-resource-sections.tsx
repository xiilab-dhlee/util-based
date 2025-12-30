"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";

import {
  kubernetesResourcePageAtom,
  kubernetesResourceSearchTextAtom,
  kubernetesResourceStatusAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { createKubernetesResourceColumn } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-list-column";
import { KubernetesResourceListFilter } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-list-filter";
import { KubernetesResourceListFooter } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-list-footer";
import { KUBERNETES_RESOURCE_LIST_PAGE_SIZE } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import {
  useDaemonsetsList,
  useDeploymentsList,
  useNamespacesList,
  useNodesList,
  usePersistentVolumesList,
  usePodsList,
  useServicesList,
  useStatefulsetsList,
} from "@/domain/kubernetes-monitoring/hooks/use-kubernetes-resource-list.hook";
import type {
  DaemonsetResourceItem,
  DeploymentResourceItem,
  GetDeploymentsPayload,
  GetNamespacesPayload,
  GetNodesPayload,
  GetPersistentVolumesPayload,
  GetPodsPayload,
  GetServicesPayload,
  NamespaceResourceItem,
  NodeResourceItem,
  PersistentVolumeResourceItem,
  PodResourceItem,
  ServiceResourceItem,
  StatefulsetResourceItem,
} from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

// ============================================================================
// 공통 타입 및 유틸리티
// ============================================================================

/**
 * 테이블용 고유 ID 생성 유틸리티
 */
function createDataSourceWithId<T extends { resourceName: string }>(
  items: T[],
): (T & { id: string })[] {
  return items.map((item, index) => {
    const namespace =
      "namespace" in item ? (item as T & { namespace: string }).namespace : "";
    return {
      ...item,
      id: `${item.resourceName}-${namespace}-${index}`,
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

  const { data, isLoading, isError } = useNodesList({
    page,
    searchText,
    status: filterValue as GetNodesPayload["status"],
  });

  const columns = useMemo(() => createKubernetesResourceColumn("Nodes"), []);
  const dataSource = createDataSourceWithId<NodeResourceItem>(
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

  const { data, isLoading, isError } = useServicesList({
    page,
    searchText,
    type: filterValue as GetServicesPayload["type"],
  });

  const columns = useMemo(() => createKubernetesResourceColumn("Service"), []);
  const dataSource = createDataSourceWithId<ServiceResourceItem>(
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

  const { data, isLoading, isError } = useDaemonsetsList({
    page,
    searchText,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Daemonsets"),
    [],
  );
  const dataSource = createDataSourceWithId<DaemonsetResourceItem>(
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

  const { data, isLoading, isError } = usePersistentVolumesList({
    page,
    searchText,
    status: filterValue as GetPersistentVolumesPayload["status"],
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("PersistentVolume"),
    [],
  );
  const dataSource = createDataSourceWithId<PersistentVolumeResourceItem>(
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

  const { data, isLoading, isError } = useNamespacesList({
    page,
    searchText,
    status: filterValue as GetNamespacesPayload["status"],
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Namespaces"),
    [],
  );
  const dataSource = createDataSourceWithId<NamespaceResourceItem>(
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
  const filterValue = useAtomValue(kubernetesResourceStatusAtom);
  const setPage = useSetAtom(kubernetesResourcePageAtom);

  const { data, isLoading, isError } = useDeploymentsList({
    page,
    searchText,
    conditions: filterValue as GetDeploymentsPayload["conditions"],
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Deployments"),
    [],
  );
  const dataSource = createDataSourceWithId<DeploymentResourceItem>(
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

  const { data, isLoading, isError } = useStatefulsetsList({
    page,
    searchText,
  });

  const columns = useMemo(
    () => createKubernetesResourceColumn("Statefulsets"),
    [],
  );
  const dataSource = createDataSourceWithId<StatefulsetResourceItem>(
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

  const { data, isLoading, isError } = usePodsList({
    page,
    searchText,
    status: filterValue as GetPodsPayload["status"],
  });

  const columns = useMemo(() => createKubernetesResourceColumn("Pods"), []);
  const dataSource = createDataSourceWithId<PodResourceItem>(
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
