import { vulnerabilityListSchema } from "@/domain/security/schemas/vulnerability.schema";
import {
  workloadDetailSchema,
  workloadListSchema,
} from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const workloadListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workloadListSchema),
);

export const workloadDetailMock = makeMock(workloadDetailSchema);

export const workloadVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListSchema),
);
