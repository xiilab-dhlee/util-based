import type { describeResource } from "@/api/generated/admin-k8s/admin-k8s";

/** API에서 사용하는 리소스 타입 (orval describeResource 함수에서 추출) */
export type K8sResourceType = Parameters<typeof describeResource>[0];

/** 리소스 Describe/YAML 모달에 필요한 정보 */
export interface K8sResourceModalPayload {
  /** API에서 사용하는 리소스 타입 (대문자) */
  resourceType: K8sResourceType;
  /** 리소스 이름 */
  name: string;
}
