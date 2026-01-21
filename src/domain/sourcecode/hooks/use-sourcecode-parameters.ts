"use client";

import { useState } from "react";

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

  /** 파라미터 배열을 Record<string, string>으로 변환 */
  toRecord: () => Record<string, string>;
}

/**
 * 소스코드 파라미터 상태 관리 훅
 *
 * 파라미터 목록의 추가/수정/삭제/초기화 및 API 요청용 변환을 제공합니다.
 */
export function useSourcecodeParameters(): UseSourcecodeParametersReturn {
  const [parameters, setParameters] = useState<SourcecodeParameterType[]>([]);

  const addParameter = (param: SourcecodeParameterType) => {
    setParameters((prev) => [...prev, param]);
  };

  const updateParameter = (index: number, param: SourcecodeParameterType) => {
    setParameters((prev) => prev.map((p, i) => (i === index ? param : p)));
  };

  const removeParameter = (index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  const resetParameters = () => {
    setParameters([]);
  };

  const toRecord = (): Record<string, string> => {
    return parameters.reduce<Record<string, string>>((acc, param) => {
      const key = param.key.trim();
      if (key) {
        acc[key] = param.value.trim();
      }
      return acc;
    }, {});
  };

  return {
    parameters,
    addParameter,
    updateParameter,
    removeParameter,
    resetParameters,
    toRecord,
  };
}
