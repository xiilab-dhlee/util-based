import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { vulnerabilityListSchema } from "@/schemas/vulnerability.schema";
import {
  workloadDetailSchema,
  workloadListSchema,
} from "@/schemas/workload.schema";
import { makeMock } from "@/utils/common/mock.util";

export const workloadListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workloadListSchema),
);

export const workloadDetailMock = makeMock(workloadDetailSchema);

export const workloadVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListSchema),
);
