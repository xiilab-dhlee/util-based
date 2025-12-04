import { securityScanListResponseSchema } from "@/domain/security/schemas/security-scan.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const securityScanListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(securityScanListResponseSchema),
);
