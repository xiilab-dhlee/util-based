import { hpeDetailSchema } from "@/domain/system-setting/schemas/hpe.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * HPE OneView 연동 정보 Mock 데이터
 */
export const hpeMockData = makeMock(hpeDetailSchema);

/**
 * 연동되지 않은 상태 Mock 데이터
 */
export const hpeEmptyMockData = null;
