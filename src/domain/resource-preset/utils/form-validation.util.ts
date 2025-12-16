import type { z } from "zod";

import type { ResourcePresetFormErrors } from "@/domain/resource-preset/schemas/resource-preset.schema";

/**
 * ResourcePresetFormErrors에서 허용된 키 목록
 * 타입 안전한 에러 매핑을 위해 명시적으로 정의
 */
const ALLOWED_ERROR_KEYS: readonly (keyof ResourcePresetFormErrors)[] = [
  "name",
  "jobType",
  "nodeType",
  "gpuType",
  "selectedGpu",
  "selectedNode",
  "selectedProfile",
] as const;

/**
 * 주어진 키가 ResourcePresetFormErrors의 유효한 키인지 확인하는 타입 가드
 * @param key - 확인할 필드명
 * @returns key가 ResourcePresetFormErrors의 키이면 true
 */
function isValidErrorKey(key: string): key is keyof ResourcePresetFormErrors {
  return ALLOWED_ERROR_KEYS.includes(key as keyof ResourcePresetFormErrors);
}

/**
 * Zod 에러를 폼 에러 구조로 매핑
 */
export function mapZodErrors(error: z.ZodError): ResourcePresetFormErrors {
  const errors: ResourcePresetFormErrors = {};

  for (const issue of error.issues) {
    const path = issue.path;

    if (path.length > 0) {
      const fieldName = path[0] as string;

      // 필드명 매핑 (gpuId → selectedGpu, nodeName → selectedNode)
      if (fieldName === "gpuId") {
        errors.selectedGpu = issue.message;
      } else if (fieldName === "nodeName") {
        errors.selectedNode = issue.message;
      } else if (isValidErrorKey(fieldName)) {
        // 타입 가드를 통과한 경우에만 안전하게 할당
        errors[fieldName] = issue.message;
      }
      // 정의되지 않은 필드는 무시 (타입 안전성 보장)
    }
  }

  return errors;
}
