import { useCallback, useState } from "react";
import type { z } from "zod";

import { REVOKE_CRITERIA } from "@/domain/revoke/constants/revoke-history.constant";
import type { RevokeCriteriaBulkPayload } from "@/domain/revoke/hooks/use-update-revoke-criteria";
import {
  type RevokeCriteriaFormType,
  type RevokeCriteriaItemType,
  revokeCriteriaFormSchema,
  revokeCriteriaRequestSchema,
} from "@/domain/revoke/schemas/revoke-history.schema";

// ===== 타입 추출 =====

/** 회수 기준에서 사용하는 Job 타입 (BATCH, INTERACTIVE만 사용) */
type RevokeCriteriaJobType = RevokeCriteriaItemType["jobType"];

// ===== 상수 =====

const INITIAL_BATCH_FORM_STATE: RevokeCriteriaFormType = {
  jobType: "BATCH",
  gpuThreshold: "",
  memoryThreshold: "",
  cpuThreshold: "",
  operationHours: "",
  warningCount: "",
  revokeCriteria: REVOKE_CRITERIA.OR,
};

const INITIAL_INTERACTIVE_FORM_STATE: RevokeCriteriaFormType = {
  jobType: "INTERACTIVE",
  gpuThreshold: "",
  memoryThreshold: "",
  cpuThreshold: "",
  operationHours: "",
  warningCount: "",
  revokeCriteria: REVOKE_CRITERIA.OR,
};

// ===== 타입 =====

/**
 * 폼 에러 키 스키마 (revokeCriteriaFormSchema에서 추출)
 * - 스키마를 단일 소스로 사용하여 중복 제거
 */
const formErrorKeySchema = revokeCriteriaFormSchema.keyof();

/**
 * 폼 에러 키 타입 (스키마에서 파생)
 */
type FormErrorKey = z.infer<typeof formErrorKeySchema>;

/**
 * 폼 에러 객체 타입
 * - FormErrorKey를 기반으로 partial 레코드 생성
 * - _error는 path가 없거나 유효하지 않은 경우 사용
 */
type RevokeCriteriaFormErrors = Partial<Record<FormErrorKey, string>> & {
  _error?: string;
};

type RevokeCriteriaDualFormState = Record<
  RevokeCriteriaJobType,
  RevokeCriteriaFormType
>;

type RevokeCriteriaDualFormErrors = Partial<
  Record<RevokeCriteriaJobType, RevokeCriteriaFormErrors>
>;

interface UseRevokeCriteriaFormReturn {
  // 상태
  formState: RevokeCriteriaDualFormState;
  errors: RevokeCriteriaDualFormErrors;

  // 필드 변경
  setField: <Key extends keyof RevokeCriteriaFormType>(
    jobType: RevokeCriteriaJobType,
    field: Key,
    value: RevokeCriteriaFormType[Key],
  ) => void;

  // 폼 제어
  /** 검증 후 성공 시 두 payload 배열로 반환, 실패 시 null 반환 */
  validate: () => RevokeCriteriaBulkPayload | null;
  reset: () => void;
  initializeForEdit: (dataList: RevokeCriteriaItemType[]) => void;
}

// ===== 유틸 함수 =====

/**
 * 유효한 폼 에러 키 목록 (스키마에서 추출)
 * - Zod keyof의 options를 사용하여 런타임 배열 생성
 */
const FORM_ERROR_KEYS = formErrorKeySchema.options;

/**
 * 타입 가드: 주어진 값이 유효한 폼 에러 키인지 확인
 * - 스키마에서 추출한 FORM_ERROR_KEYS를 사용
 */
function isValidFormErrorKey(key: unknown): key is FormErrorKey {
  return (
    typeof key === "string" && FORM_ERROR_KEYS.includes(key as FormErrorKey)
  );
}

/**
 * Zod 에러를 폼 에러 구조로 매핑
 * - path가 비어있거나 유효하지 않은 키인 경우 _error 키에 저장
 */
function mapZodErrors(error: z.ZodError): RevokeCriteriaFormErrors {
  const errors: RevokeCriteriaFormErrors = {};

  for (const issue of error.issues) {
    // path가 비어있는지 확인
    if (issue.path.length === 0) {
      errors._error = issue.message;
      continue;
    }

    const firstPathElement = issue.path[0];

    // 유효한 폼 키인지 검증
    if (isValidFormErrorKey(firstPathElement)) {
      errors[firstPathElement] = issue.message;
    } else {
      // 유효하지 않은 키는 일반 에러로 저장
      errors._error = issue.message;
    }
  }

  return errors;
}

/**
 * 서버 응답 데이터를 폼 상태로 변환
 */
function responseToFormState(
  data: RevokeCriteriaItemType,
): RevokeCriteriaFormType {
  return {
    jobType: data.jobType,
    gpuThreshold: String(data.gpuThreshold),
    memoryThreshold: String(data.memoryThreshold),
    cpuThreshold: String(data.cpuThreshold),
    operationHours: String(data.operationHours),
    warningCount: String(data.warningCount),
    revokeCriteria: data.revokeCriteria,
  };
}

// ===== 훅 =====

/**
 * 리소스 회수 기준 폼 상태 및 검증 훅 (Batch + Interactive)
 * - 두 개의 폼(BATCH, INTERACTIVE)을 동시에 관리
 * - 순수 폼 상태 관리 + Zod 검증만 담당
 * - 검증 성공 시 배열로 반환하여 API에 전송
 */
export function useRevokeCriteriaForm(): UseRevokeCriteriaFormReturn {
  // 폼 상태 - BATCH와 INTERACTIVE 두 개 관리
  const [formState, setFormState] = useState<RevokeCriteriaDualFormState>({
    BATCH: INITIAL_BATCH_FORM_STATE,
    INTERACTIVE: INITIAL_INTERACTIVE_FORM_STATE,
  });
  const [errors, setErrors] = useState<RevokeCriteriaDualFormErrors>({});

  // ===== 필드 변경 =====

  const setField = <Key extends keyof RevokeCriteriaFormType>(
    jobType: RevokeCriteriaJobType,
    field: Key,
    value: RevokeCriteriaFormType[Key],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [jobType]: {
        ...prev[jobType],
        [field]: value,
      },
    }));

    // 해당 필드 에러 클리어
    setErrors((prev) => {
      if (!prev[jobType]?.[field]) return prev;
      return {
        ...prev,
        [jobType]: {
          ...prev[jobType],
          [field]: undefined,
        },
      };
    });
  };

  // ===== 폼 제어 =====

  /**
   * 폼 검증 - 두 폼 모두 검증하여 성공 시 두 payload 배열로 반환, 실패 시 null 반환
   */
  const validate = (): RevokeCriteriaBulkPayload | null => {
    // 두 폼 모두 검증
    const batchResult = revokeCriteriaRequestSchema.safeParse(formState.BATCH);
    const interactiveResult = revokeCriteriaRequestSchema.safeParse(
      formState.INTERACTIVE,
    );

    // 검증 실패 시 에러 설정
    if (!batchResult.success || !interactiveResult.success) {
      const newErrors: RevokeCriteriaDualFormErrors = {};

      if (!batchResult.success) {
        newErrors.BATCH = mapZodErrors(batchResult.error);
      }

      if (!interactiveResult.success) {
        newErrors.INTERACTIVE = mapZodErrors(interactiveResult.error);
      }

      setErrors(newErrors);
      return null;
    }

    // 에러 클리어 및 검증된 payload 배열로 반환
    setErrors({});
    return [batchResult.data, interactiveResult.data];
  };

  const reset = () => {
    setFormState({
      BATCH: INITIAL_BATCH_FORM_STATE,
      INTERACTIVE: INITIAL_INTERACTIVE_FORM_STATE,
    });
    setErrors({});
  };

  const initializeForEdit = useCallback(
    (dataList: RevokeCriteriaItemType[]) => {
      const batchData = dataList.find((d) => d.jobType === "BATCH");
      const interactiveData = dataList.find((d) => d.jobType === "INTERACTIVE");

      setFormState({
        BATCH: batchData
          ? responseToFormState(batchData)
          : INITIAL_BATCH_FORM_STATE,
        INTERACTIVE: interactiveData
          ? responseToFormState(interactiveData)
          : INITIAL_INTERACTIVE_FORM_STATE,
      });
      setErrors({});
    },
    [],
  );

  return {
    // 상태
    formState,
    errors,

    // 필드 변경
    setField,

    // 폼 제어
    validate,
    reset,
    initializeForEdit,
  };
}
