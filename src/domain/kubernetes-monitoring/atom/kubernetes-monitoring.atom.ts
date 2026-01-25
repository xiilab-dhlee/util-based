import { atomWithReset } from "jotai/utils";

import {
  GetNamespacesStatus,
  GetNodesStatus,
  GetPersistentVolumesStatus,
  GetPodsStatus,
  GetServicesType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  KUBERNETES_RESOURCE_NAMES,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";

/**
 * 쿠버네티스 리소스 필터 상태 유니온 타입
 */
export type KubernetesResourceFilterStatus =
  | GetNodesStatus
  | GetServicesType
  | GetPodsStatus
  | GetPersistentVolumesStatus
  | GetNamespacesStatus;

/**
 * 타입 가드: GetNodesStatus 검증
 */
export function isNodeFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is GetNodesStatus | undefined {
  if (value === undefined) return true;
  return Object.values(GetNodesStatus).some((item) => item === value);
}

/**
 * 타입 가드: GetServicesType 검증
 */
export function isServiceFilterType(
  value: KubernetesResourceFilterStatus | undefined,
): value is GetServicesType | undefined {
  if (value === undefined) return true;
  return Object.values(GetServicesType).some((item) => item === value);
}

/**
 * 타입 가드: GetPodsStatus 검증
 */
export function isPodFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is GetPodsStatus | undefined {
  if (value === undefined) return true;
  return Object.values(GetPodsStatus).some((item) => item === value);
}

/**
 * 타입 가드: GetPersistentVolumesStatus 검증
 */
export function isPersistentVolumeFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is GetPersistentVolumesStatus | undefined {
  if (value === undefined) return true;
  return Object.values(GetPersistentVolumesStatus).some(
    (item) => item === value,
  );
}

/**
 * 타입 가드: GetNamespacesStatus 검증
 */
export function isNamespaceFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is GetNamespacesStatus | undefined {
  if (value === undefined) return true;
  return Object.values(GetNamespacesStatus).some((item) => item === value);
}

/** 쿠버네티스 리소스 리스트 페이지 번호 */
export const kubernetesResourcePageAtom = atomWithReset<number>(1);

/** 쿠버네티스 리소스 리스트 검색어 */
export const kubernetesResourceSearchTextAtom = atomWithReset<string>("");

/** 쿠버네티스 리소스 상태 필터 */
export const kubernetesResourceStatusAtom = atomWithReset<
  KubernetesResourceFilterStatus | undefined
>(undefined);

/** 선택된 리소스 이름 (Nodes, Pods 등) */
export const kubernetesSelectedResourceNameAtom =
  atomWithReset<KubernetesResourceName>(KUBERNETES_RESOURCE_NAMES[0]);

/** 쿠버네티스 이벤트 상세 모달 open 상태 */
export const openKubernetesEventDetailModalAtom = atomWithReset<boolean>(false);

/** 쿠버네티스 Describe 모달 open 상태 */
export const openKubernetesDescribeModalAtom = atomWithReset<boolean>(false);

/** 쿠버네티스 YAML 모달 open 상태 */
export const openKubernetesYamlModalAtom = atomWithReset<boolean>(false);

/** 쿠버네티스 이벤트 리스트 페이지 번호 */
export const kubernetesEventPageAtom = atomWithReset<number>(1);
