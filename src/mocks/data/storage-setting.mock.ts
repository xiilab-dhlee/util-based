import { STORAGE_SETTING_PAGE_SIZE } from "@/domain/system-setting/constants/system-setting.constant";
import {
  storageSettingDetailSchema,
  storageSettingListSchema,
} from "@/domain/system-setting/schemas/storage-setting.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 스토리지 설정 목록 모킹 데이터 (8개)
 */
export const storageSettingListMock = Array.from(
  { length: STORAGE_SETTING_PAGE_SIZE },
  () => makeMock(storageSettingListSchema),
);

/**
 * 스토리지 설정 상세 모킹 데이터
 */
export const storageSettingDetailMock = makeMock(storageSettingDetailSchema);
