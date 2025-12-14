import type { z } from "zod";

import type { ResourcePresetFormErrors } from "@/domain/resource-preset/schemas/resource-preset.schema";

/**
 * Zod 에러를 폼 에러 구조로 매핑
 */
export function mapZodErrors(error: z.ZodError): ResourcePresetFormErrors {
  const errors: ResourcePresetFormErrors = {};

  for (const issue of error.issues) {
    const path = issue.path;

    if (path.length > 0) {
      const fieldName = path[0] as string;

      // 필드명 매핑
      if (fieldName === "gpuId") {
        errors.selectedGpu = issue.message;
      } else if (fieldName === "nodeName") {
        errors.selectedNode = issue.message;
      } else {
        (errors as Record<string, string>)[fieldName] = issue.message;
      }
    }
  }

  return errors;
}
