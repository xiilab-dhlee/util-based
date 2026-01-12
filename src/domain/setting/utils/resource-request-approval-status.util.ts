import type { ResourceRequestListResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { APPROVAL_STATUS_LABEL } from "@/domain/setting/constants/setting.constant";

export function getApprovalStatusLabel(
  status: ResourceRequestListResponseApprovalStatus,
): string {
  return APPROVAL_STATUS_LABEL[status];
}
