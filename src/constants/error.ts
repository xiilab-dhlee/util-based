import type { ErrorConfigMap } from "@/shared/types/error";

export const getAllErrorConfigs = (): ErrorConfigMap => {
  return {
    default: {
      showToast: true,
      errorMessage: "알 수 없는 오류가 발생했습니다.",
      statusMessages: {},
    },
  };
};
