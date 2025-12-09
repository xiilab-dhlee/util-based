import { vulnerabilityListResponseSchema } from "@/domain/security/schemas/vulnerability.schema";
import {
  activeWorkloadListSchema,
  disabledWorkloadListSchema,
  workloadDetailSchema,
  workloadListSchema,
} from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const workloadListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workloadListSchema),
);

export const activeWorkloadListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(activeWorkloadListSchema),
);

export const disabledWorkloadListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(disabledWorkloadListSchema),
);

export const workloadDetailMock = makeMock(workloadDetailSchema);

export const workloadVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListResponseSchema),
);
