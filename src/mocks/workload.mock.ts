import { Workload } from "@/models/workload.model";
import { vulnerabilityListSchema } from "@/schemas/vulnerability.schema";
import {
  workloadDetailSchema,
  workloadListSchema,
} from "@/schemas/workload.schema";
import { makeMock } from "@/utils/common/mock.util";

export const workloadListMock = Array.from(
  { length: Workload.LIST_PAGE_SIZE },
  () => makeMock(workloadListSchema),
);

export const workloadDetailMock = makeMock(workloadDetailSchema);

export const vulnerabilityListMock = Array.from(
  { length: Workload.SECURITY_PAGE_SIZE },
  () => makeMock(vulnerabilityListSchema),
);
