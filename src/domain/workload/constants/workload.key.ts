import type {
  GetWorkloadFilesPayload,
  GetWorkloadPayload,
  GetWorkloadsPayload,
  GetWorkloadVulnerabilitiesPayload,
} from "@/domain/workload/types/workload.type";

export const workloadKeys = {
  default: ["workload"],
  list: (payload: GetWorkloadsPayload) => [
    ...workloadKeys.default,
    "list",
    ...Object.values(payload),
  ],
  adminList: (payload: GetWorkloadsPayload) => [
    ...workloadKeys.default,
    "adminList",
    ...Object.values(payload),
  ],
  detail: (payload: GetWorkloadPayload) => [
    ...workloadKeys.default,
    "detail",
    ...Object.values(payload),
  ],
  adminDetail: (payload: GetWorkloadPayload) => [
    ...workloadKeys.default,
    "adminDetail",
    ...Object.values(payload),
  ],
  fileList: (payload: GetWorkloadFilesPayload) => [
    ...workloadKeys.default,
    "fileList",
    ...Object.values(payload),
  ],
  vulnerabilityList: (payload: GetWorkloadVulnerabilitiesPayload) => [
    ...workloadKeys.default,
    "vulnerabilityList",
    ...Object.values(payload),
  ],
};
