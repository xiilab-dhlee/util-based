import { registerErrorConfig } from "@/constants/error";
import type { ErrorConfig } from "@/types/common/error";

const workspaceErrorConfig: Record<string, ErrorConfig> = {
  "workspace.list": {
    showToast: true,
    errorMessage: "워크스페이스 목록을 불러올 수 없습니다.",
  },
  "workspace.detail": {
    showToast: false,
    errorMessage: "워크스페이스 상세 정보를 불러올 수 없습니다.",
  },
  "workspace.fileList": {
    showToast: true,
    errorMessage: "워크스페이스 파일 목록을 불러올 수 없습니다.",
  },
  "workspace.securityList": {
    showToast: true,
    errorMessage: "워크스페이스 보안 목록을 불러올 수 없습니다.",
  },
};

// 명시적 등록 (각 도메인 파일에서 직접 호출)
registerErrorConfig(workspaceErrorConfig);

export default workspaceErrorConfig;
