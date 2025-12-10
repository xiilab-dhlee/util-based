import { vulnerabilityListResponseSchema } from "@/domain/security/schemas/vulnerability.schema";
import {
  activeWorkloadListSchema,
  disabledWorkloadListSchema,
  workloadDetailSchema,
  workloadListSchema,
} from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const workloadListMock =
  Math.random() < 0.5
    ? []
    : Array.from({ length: LIST_PAGE_SIZE }, () =>
        makeMock(workloadListSchema),
      );

export const activeWorkloadListMock =
  Math.random() < 0.5
    ? []
    : Array.from({ length: LIST_PAGE_SIZE }, () =>
        makeMock(activeWorkloadListSchema),
      );

export const disabledWorkloadListMock =
  Math.random() < 0.5
    ? []
    : Array.from({ length: LIST_PAGE_SIZE }, () =>
        makeMock(disabledWorkloadListSchema),
      );

export const workloadDetailMock =
  Math.random() < 0.5 ? null : makeMock(workloadDetailSchema);

export const workloadVulnerabilityListMock =
  Math.random() < 0.5
    ? []
    : Array.from({ length: LIST_PAGE_SIZE }, () =>
        makeMock(vulnerabilityListResponseSchema),
      );
