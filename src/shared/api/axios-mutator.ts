import type { AxiosRequestConfig } from "axios";
import { isPlainObject } from "es-toolkit";

import { AxiosService } from "@/shared/api/axios";
import {
  serializeParams,
  unwrapSuccess,
} from "@/shared/api/axios-mutator.util";
import type { BaseResponse } from "@/shared/types/api-response.type";
import { BackendError } from "@/shared/types/error.type";
import { isEnvelopeResponse } from "@/shared/utils/api-response-envelope.util";

type UnwrappedResponse<T> = T extends Pick<BaseResponse, "status" | "timestamp">
  ? BaseResponseData<T>
  : T;

type BaseResponseData<T> = T extends { data: infer D }
  ? D
  : T extends { data?: infer D }
    ? Exclude<D, undefined>
    : undefined;

export function customInstance<T>(
  config: AxiosRequestConfig,
): Promise<UnwrappedResponse<T>>;

export async function customInstance(
  config: AxiosRequestConfig,
): Promise<unknown> {
  const axiosInstance = AxiosService.getInstance().getAxios();
  const shouldSerializeParams = config.params && isPlainObject(config.params);

  const processedConfig: AxiosRequestConfig = shouldSerializeParams
    ? {
        ...config,
        paramsSerializer: {
          serialize: (params) => serializeParams(params),
        },
      }
    : config;

  const response = await axiosInstance.request(processedConfig);
  const body: unknown = response.data;

  if (!isEnvelopeResponse(body)) return body;

  switch (body.status) {
    case "FAIL":
    case "ERROR":
      throw new BackendError(body.message ?? "서버 오류", body);
    case "SUCCESS":
      return unwrapSuccess(body, config);
    default: {
      const _exhaustiveCheck: never = body.status;
      throw new Error(
        `[API Error] 처리되지 않은 status: ${_exhaustiveCheck} (URL: ${config.url ?? "(unknown url)"})`,
      );
    }
  }
}
