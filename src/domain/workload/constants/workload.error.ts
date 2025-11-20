import { registerErrorConfig } from "@/constants/error";
import type { ErrorConfig } from "@/shared/types/error";

// 🎯 워크로드 도메인 에러 설정
const workloadErrorConfig: Record<string, ErrorConfig> = {
  "workload.list": {
    showToast: true,
    errorMessage: "워크로드 목록을 불러올 수 없습니다.",
  },
  "workload.detail": {
    showToast: false,
    errorMessage: "워크로드 상세 정보를 불러올 수 없습니다.",
  },
  "workload.fileList": {
    showToast: true,
    errorMessage: "워크로드 파일 목록을 불러올 수 없습니다.",
  },
  "workload.securityList": {
    showToast: true,
    errorMessage: "워크로드 보안 목록을 불러올 수 없습니다.",
  },
};

// 🚀 자동으로 중앙 레지스트리에 등록
registerErrorConfig(workloadErrorConfig);

// export (필요시)
export { workloadErrorConfig };
