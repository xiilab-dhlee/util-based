import type { AxiosRequestConfig } from "axios";

import { AxiosService } from "./axios";

type UnwrappedResponse<T> = T extends { data?: infer D } ? D : T;

export const customInstance = async <T>(
  config: AxiosRequestConfig,
): Promise<UnwrappedResponse<T>> => {
  const axiosInstance = AxiosService.getInstance().getAxios();
  const response = await axiosInstance.request(config);
  const baseResponse = response.data;

  // BaseResponse 구조 확인 (status 필드 존재 여부)
  if (
    baseResponse &&
    typeof baseResponse === "object" &&
    "status" in baseResponse
  ) {
    if (baseResponse.status === "SUCCESS") {
      return baseResponse.data as UnwrappedResponse<T>;
    }
    if (baseResponse.status === "FAIL" || baseResponse.status === "ERROR") {
      throw new Error(baseResponse.message || "Request failed");
    }
  }

  // BaseResponse 형식이 아닌 경우 그대로 반환 (하위 호환성)
  return baseResponse as UnwrappedResponse<T>;
};
