import type { ErrorConfig } from "@/shared/types/error.type";

/**
 * 스토리지 설정 도메인 에러 설정
 */
export const storageSettingErrorConfig: Record<string, ErrorConfig> = {
  // 목록 조회 - 토스트 표시 안함
  "system-setting.storage.list": {
    showToast: false,
    errorMessage: "스토리지 설정 목록을 불러올 수 없습니다.",
  },
  // 생성 - 토스트 표시
  "system-setting.storage.create": {
    showToast: true,
    errorMessage: "스토리지 설정 등록에 실패했습니다.",
  },
  // 수정 - 토스트 표시
  "system-setting.storage.update": {
    showToast: true,
    errorMessage: "스토리지 설정 수정에 실패했습니다.",
  },
  // 삭제 - 토스트 표시
  "system-setting.storage.delete": {
    showToast: true,
    errorMessage: "스토리지 설정 삭제에 실패했습니다.",
  },
};
