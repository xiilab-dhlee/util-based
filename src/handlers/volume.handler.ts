import { HttpResponse, http } from "msw";

import filetreeConstants from "@/constants/common/filetree.constant";
import { volumeDetailMock, volumeListMock } from "@/mocks/volume.mock";
import { generateCustomTree } from "@/utils/common/filetree-generator.util";

/**
 * 볼륨 API 핸들러
 */
export const volumeHandlers = [
  // 볼륨 목록 조회
  http.get("/core-api/v1/core/volume", () => {
    return HttpResponse.json({
      content: volumeListMock,
      totalSize: 100,
    });
  }),
  // 볼륨 상세 조회
  http.get("/core-api/v1/core/volume/:id", () => {
    return HttpResponse.json(volumeDetailMock);
  }),
  // 볼륨 파일 목록 조회
  http.get("/core-api/v1/core/volume/:id/files/list", () => {
    return HttpResponse.json({
      content: generateCustomTree(
        filetreeConstants.mlProjectTemplate,
      ),
      directoryCnt: 10,
      total: 100,
    });
  }),
];
