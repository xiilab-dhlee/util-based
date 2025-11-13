import type {
  GetWorkloadFilesPayload,
  GetWorkloadPayload,
  GetWorkloadsPayload,
  GetWorkloadVulnerabilitiesPayload,
} from "@/types/workload/workload.type";

export const workloadKeys = {
  default: ["workload"],
  list: (payload: GetWorkloadsPayload): string[] => [
    ...workloadKeys.default,
    "list",
    ...(Object.values(payload) as string[]),
  ],
  adminList: (payload: GetWorkloadsPayload): string[] => [
    ...workloadKeys.default,
    "adminList",
    ...(Object.values(payload) as string[]),
  ],
  detail: (payload: GetWorkloadPayload): string[] => [
    ...workloadKeys.default,
    "detail",
    ...(Object.values(payload) as string[]),
  ],
  adminDetail: (payload: GetWorkloadPayload): string[] => [
    ...workloadKeys.default,
    "adminDetail",
    ...(Object.values(payload) as string[]),
  ],
  fileList: (payload: GetWorkloadFilesPayload): string[] => [
    ...workloadKeys.default,
    "fileList",
    ...(Object.values(payload) as string[]),
  ],
  vulnerabilityList: (payload: GetWorkloadVulnerabilitiesPayload): string[] => [
    ...workloadKeys.default,
    "vulnerabilityList",
    ...(Object.values(payload) as string[]),
  ],
};
