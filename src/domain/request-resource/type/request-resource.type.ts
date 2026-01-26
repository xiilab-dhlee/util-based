import type { GetResourceRequests1ApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AllOptionValue } from "@/shared/constants/core.constant";

/** 리소스 신청 상태 필터 타입 */
export type RequestResourceStatusFilter =
  | GetResourceRequests1ApprovalStatus
  | AllOptionValue
  | undefined;
