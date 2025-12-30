import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";
import type { CoreListResponse } from "@/shared/types/core.model";

/** Node 상태 타입 */
export type NodeStatus = "Ready" | "NotReady";

/** PersistentVolume 상태 타입 */
export type PersistentVolumeStatus =
  | "Available"
  | "Bound"
  | "Released"
  | "Failed";

/** Namespace 상태 타입 */
export type NamespaceStatus = "Active" | "Terminating";

/** Pod 상태 타입 */
export type PodStatus =
  | "Pending"
  | "Running"
  | "Succeeded"
  | "Failed"
  | "Unknown";

/** Service 타입 */
export type ServiceType =
  | "ClusterIP"
  | "NodePort"
  | "LoadBalancer"
  | "ExternalName";

/** Deployment 조건 타입 */
export type DeploymentCondition = "Available" | "Progressing";

/** Service 상태 타입 */
export type ServiceStatus = "Running" | "Pending" | "Failed";

/** Daemonset 상태 타입 */
export type DaemonsetStatus = "Running" | "Pending" | "Failed";

/** Deployment 상태 타입 */
export type DeploymentStatus = "Running" | "Pending" | "Failed";

/** Statefulset 상태 타입 */
export type StatefulsetStatus = "Running" | "Pending" | "Failed";

/** 기본 리소스 목록 조회 Payload */
interface BaseResourceListPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

/** Nodes 목록 조회 Payload */
export interface GetNodesPayload extends BaseResourceListPayload {
  status?: NodeStatus;
}

/** Service 목록 조회 Payload */
export interface GetServicesPayload extends BaseResourceListPayload {
  type?: ServiceType;
}

/** Daemonsets 목록 조회 Payload */
export type GetDaemonsetsPayload = BaseResourceListPayload;

/** PersistentVolume 목록 조회 Payload */
export interface GetPersistentVolumesPayload extends BaseResourceListPayload {
  status?: PersistentVolumeStatus;
}

/** Namespaces 목록 조회 Payload */
export interface GetNamespacesPayload extends BaseResourceListPayload {
  status?: NamespaceStatus;
}

/** Deployments 목록 조회 Payload */
export interface GetDeploymentsPayload extends BaseResourceListPayload {
  conditions?: DeploymentCondition;
}

/** Statefulsets 목록 조회 Payload */
export type GetStatefulsetsPayload = BaseResourceListPayload;

/** Pods 목록 조회 Payload */
export interface GetPodsPayload extends BaseResourceListPayload {
  status?: PodStatus;
}

// ============================================================================
// 리소스 아이템 타입
// ============================================================================

/** 기본 리소스 아이템 (공통 필드) */
interface BaseResourceItem {
  resourceName: string;
  createDateTime: string;
}

/** Namespace를 포함하는 리소스 아이템 */
interface NamespacedResourceItem extends BaseResourceItem {
  namespace: string;
}

/** Node 리소스 아이템 */
export interface NodeResourceItem extends BaseResourceItem {
  role: "master" | "worker";
  gpu: string;
  status: NodeStatus;
}

/** Service 리소스 아이템 */
export interface ServiceResourceItem extends NamespacedResourceItem {
  type: ServiceType;
  ports: string;
  status: ServiceStatus;
}

/** Daemonset 리소스 아이템 */
export interface DaemonsetResourceItem extends NamespacedResourceItem {
  pods: string;
  status: DaemonsetStatus;
}

/** PersistentVolume 리소스 아이템 */
export interface PersistentVolumeResourceItem extends BaseResourceItem {
  storageClass: string;
  status: PersistentVolumeStatus;
}

/** Namespace 리소스 아이템 */
export interface NamespaceResourceItem extends BaseResourceItem {
  age: string;
  status: NamespaceStatus;
}

/** Deployment 리소스 아이템 */
export interface DeploymentResourceItem extends NamespacedResourceItem {
  pods: string;
  conditions: string;
  status: DeploymentStatus;
}

/** Statefulset 리소스 아이템 */
export interface StatefulsetResourceItem extends NamespacedResourceItem {
  pods: string;
  status: StatefulsetStatus;
}

/** Pod 리소스 아이템 */
export interface PodResourceItem extends NamespacedResourceItem {
  node: string;
  status: PodStatus;
}

/** 모든 리소스 아이템 유니온 타입 */
export type AllResourceItem =
  | NodeResourceItem
  | ServiceResourceItem
  | DaemonsetResourceItem
  | PersistentVolumeResourceItem
  | NamespaceResourceItem
  | DeploymentResourceItem
  | StatefulsetResourceItem
  | PodResourceItem;

// ============================================================================
// Response 타입 (각 리소스별)
// ============================================================================

/** Nodes 목록 응답 */
export type NodeListResponse = CoreListResponse<NodeResourceItem>;

/** Service 목록 응답 */
export type ServiceListResponse = CoreListResponse<ServiceResourceItem>;

/** Daemonsets 목록 응답 */
export type DaemonsetListResponse = CoreListResponse<DaemonsetResourceItem>;

/** PersistentVolume 목록 응답 */
export type PersistentVolumeListResponse =
  CoreListResponse<PersistentVolumeResourceItem>;

/** Namespaces 목록 응답 */
export type NamespaceListResponse = CoreListResponse<NamespaceResourceItem>;

/** Deployments 목록 응답 */
export type DeploymentListResponse = CoreListResponse<DeploymentResourceItem>;

/** Statefulsets 목록 응답 */
export type StatefulsetListResponse = CoreListResponse<StatefulsetResourceItem>;

/** Pods 목록 응답 */
export type PodListResponse = CoreListResponse<PodResourceItem>;

/**
 * 쿠버네티스 이벤트 타입
 * 이벤트 카드 및 상세 모달에서 사용
 */
export interface KubernetesEventType {
  eventId: string;
  namespace: string;
  status: string;
  object: string;
  ipAddress: string;
  message: string;
  dateTime: string;
}
