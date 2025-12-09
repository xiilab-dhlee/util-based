import { HttpResponse, http } from "msw";

import {
  storageSettingDetailMock,
  storageSettingListMock,
} from "@/mocks/data/storage-setting.mock";

/**
 * 스토리지 설정 API 핸들러
 */
export const storageSettingHandlers = [
  // 스토리지 설정 목록 조회
  http.get("/core-api/v1/core/setting/storage", () => {
    return HttpResponse.json({
      content: storageSettingListMock,
      totalSize: 100,
    });
  }),

  // 스토리지 설정 상세 조회
  http.get("/core-api/v1/core/setting/storage/:id", () => {
    return HttpResponse.json(storageSettingDetailMock);
  }),
];
