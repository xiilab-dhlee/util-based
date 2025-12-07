import { reportListResponseSchema } from "@/domain/report/schemas/report.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 리포트 목록 Mock 데이터
 */
export const reportListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(reportListResponseSchema),
);
