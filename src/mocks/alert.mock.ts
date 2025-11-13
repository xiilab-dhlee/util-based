import alertListConstants from "@/constants/alert/alert-list.constant";
import { alertDetailSchema, alertListSchema } from "@/schemas/alert.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 알림 목록 Mock 데이터
 */
export const alertListMock = Array.from(
  { length: alertListConstants.pageSize },
  () => makeMock(alertListSchema),
);

/**
 * 알림 상세 Mock 데이터
 */
export const alertDetailMock = makeMock(alertDetailSchema);
