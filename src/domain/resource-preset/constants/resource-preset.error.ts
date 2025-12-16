import type { ErrorConfig } from "@/shared/types/error.type";

/**
 * 리소스 프리셋 도메인 에러 설정
 */
export const resourcePresetErrorConfig: Record<string, ErrorConfig> = {
  // GET 요청 (조회) - 토스트 표시 안함
  "resource-preset.list": {
    showToast: false,
    errorMessage: "리소스 프리셋 목록을 불러올 수 없습니다.",
  },
  "resource-preset.detail": {
    showToast: false,
    errorMessage: "리소스 프리셋 상세 정보를 불러올 수 없습니다.",
  },
  // Mutation 요청 (생성/수정/삭제) - 토스트 표시
  "resource-preset.create": {
    showToast: true,
    errorMessage: "리소스 프리셋 생성에 실패했습니다.",
  },
  "resource-preset.update": {
    showToast: true,
    errorMessage: "리소스 프리셋 수정에 실패했습니다.",
  },
  "resource-preset.delete": {
    showToast: true,
    errorMessage: "리소스 프리셋 삭제에 실패했습니다.",
  },
};
