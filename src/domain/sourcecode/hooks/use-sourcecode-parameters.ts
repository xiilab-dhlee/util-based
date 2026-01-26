"use client";

import { useCallback, useState } from "react";

import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";

export interface UseSourcecodeParametersReturn {
  /** 파라미터 목록 */
  parameters: SourcecodeParameterType[];

  /** 파라미터 추가 */
  addParameter: (param: SourcecodeParameterType) => void;

  /** 파라미터 수정 */
  updateParameter: (index: number, param: SourcecodeParameterType) => void;

  /** 파라미터 삭제 */
  removeParameter: (index: number) => void;

  /** 파라미터 목록 초기화 */
  resetParameters: () => void;

  /** 파라미터 목록 설정 (초기값 또는 외부 값으로 설정) */
  setParameters: (params: SourcecodeParameterType[]) => void;

  /** Record 형태의 파라미터를 배열로 변환하여 설정 */
  setParametersFromRecord: (record: Record<string, string> | undefined) => void;

  /** 파라미터 배열을 Record<string, string>으로 변환 */
  toRecord: () => Record<string, string>;
}

/**
 * 소스코드 파라미터 상태 관리 훅
 *
 * 파라미터 목록의 추가/수정/삭제/초기화 및 API 요청용 변환을 제공합니다.
 */
export function useSourcecodeParameters(
  initialParameters?: SourcecodeParameterType[],
): UseSourcecodeParametersReturn {
  const [parameters, setParametersState] = useState<SourcecodeParameterType[]>(
    initialParameters ?? [],
  );

  const addParameter = useCallback((param: SourcecodeParameterType) => {
    setParametersState((prev) => [...prev, param]);
  }, []);

  const updateParameter = useCallback(
    (index: number, param: SourcecodeParameterType) => {
      setParametersState((prev) =>
        prev.map((p, i) => (i === index ? param : p)),
      );
    },
    [],
  );

  const removeParameter = useCallback((index: number) => {
    setParametersState((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetParameters = useCallback(() => {
    setParametersState([]);
  }, []);

  const setParameters = useCallback((params: SourcecodeParameterType[]) => {
    setParametersState(params);
  }, []);

  const setParametersFromRecord = useCallback(
    (record: Record<string, string> | undefined) => {
      const params = Object.entries(record || {}).map(([key, value]) => ({
        key,
        value,
      }));
      setParametersState(params);
    },
    [],
  );

  const toRecord = useCallback((): Record<string, string> => {
    return parameters.reduce<Record<string, string>>((acc, param) => {
      const key = param.key.trim();
      if (key) {
        acc[key] = param.value.trim();
      }
      return acc;
    }, {});
  }, [parameters]);

  return {
    parameters,
    addParameter,
    updateParameter,
    removeParameter,
    resetParameters,
    setParameters,
    setParametersFromRecord,
    toRecord,
  };
}
