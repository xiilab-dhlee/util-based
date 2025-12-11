import { licenseListResponseSchema } from "@/domain/system-setting/schemas/license.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 라이선스 Mock 데이터
 * 현재 활성 라이선스 + 등록 이력
 */
export const licenseMock = makeMock(licenseListResponseSchema);

/**
 * Empty 상태의 라이선스 Mock 데이터
 */
export const emptyLicenseMock = makeMock(
  licenseListResponseSchema.extend({
    current: licenseListResponseSchema.shape.current.default(null),
    history: licenseListResponseSchema.shape.history.default([]),
    totalCount: licenseListResponseSchema.shape.totalCount.default(0),
  }),
);
