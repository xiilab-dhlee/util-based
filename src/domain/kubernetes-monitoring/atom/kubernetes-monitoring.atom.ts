import { atomWithReset } from "jotai/utils";

import {
  NamespaceFilterRequestStatus,
  NodeFilterRequestStatus,
  PersistentVolumeFilterRequestStatus,
  PodFilterRequestStatus,
  ServiceFilterRequestType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  KUBERNETES_RESOURCE_NAMES,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";

/**
 * 쿠버네티스 리소스 필터 상태 유니온 타입
 */
export type KubernetesResourceFilterStatus =
  | NodeFilterRequestStatus
  | ServiceFilterRequestType
  | PodFilterRequestStatus
  | PersistentVolumeFilterRequestStatus
  | NamespaceFilterRequestStatus;

/**
 * 타입 가드: NodeFilterRequestStatus 검증
 */
export function isNodeFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is NodeFilterRequestStatus | undefined {
  if (value === undefined) return true;
  return Object.values(NodeFilterRequestStatus).some((item) => item === value);
}

/**
 * 타입 가드: ServiceFilterRequestType 검증
 */
export function isServiceFilterType(
  value: KubernetesResourceFilterStatus | undefined,
): value is ServiceFilterRequestType | undefined {
  if (value === undefined) return true;
  return Object.values(ServiceFilterRequestType).some((item) => item === value);
}

/**
 * 타입 가드: PodFilterRequestStatus 검증
 */
export function isPodFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is PodFilterRequestStatus | undefined {
  if (value === undefined) return true;
  return Object.values(PodFilterRequestStatus).some((item) => item === value);
}

/**
 * 타입 가드: PersistentVolumeFilterRequestStatus 검증
 */
export function isPersistentVolumeFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is PersistentVolumeFilterRequestStatus | undefined {
  if (value === undefined) return true;
  return Object.values(PersistentVolumeFilterRequestStatus).some(
    (item) => item === value,
  );
}

/**
 * 타입 가드: NamespaceFilterRequestStatus 검증
 */
export function isNamespaceFilterStatus(
  value: KubernetesResourceFilterStatus | undefined,
): value is NamespaceFilterRequestStatus | undefined {
  if (value === undefined) return true;
  return Object.values(NamespaceFilterRequestStatus).some(
    (item) => item === value,
  );
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
