import { HttpResponse, http } from "msw";

import filetreeConstants from "@/constants/common/filetree.constant";
import { generateCustomTree } from "@/utils/common/filetree-generator.util";

/**
 * 그룹 API 핸들러
 */
export const groupHandlers = [
  // 그룹 목록 조회
  http.get("/core-api/v1/core/group", () => {
    return HttpResponse.json({
      content: generateCustomTree(
        filetreeConstants.groupProjectTemplate,
      ),
      directoryCnt: 10,
      total: 100,
    });
  }),
];
