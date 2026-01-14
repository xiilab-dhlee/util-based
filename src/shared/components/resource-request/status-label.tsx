import type { ReactNode } from "react";
import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type {
  AdminResourceRequestListResponseApprovalStatus,
  ResourceRequestListResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

type ResourceRequestApprovalStatus =
  | ResourceRequestListResponseApprovalStatus
  | AdminResourceRequestListResponseApprovalStatus;

interface ResourceRequestStatusLabelProps {
  status: ResourceRequestApprovalStatus;
  children: ReactNode;
}

function getVariant(status: ResourceRequestApprovalStatus): LabelColorVariant {
  switch (status) {
    case "WAITING":
      return "green";
    case "REJECTED":
      return "red";
    case "APPROVED":
      return "blue";
    default:
      return "black";
  }
}

export function ResourceRequestStatusLabel({
  status,
  children,
}: ResourceRequestStatusLabelProps) {
  return <Label variant={getVariant(status)}>{children}</Label>;
}
