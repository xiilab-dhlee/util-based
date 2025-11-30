import { useState } from "react";
import type { z } from "zod";

import {
  type GroupFormType,
  type GroupListResponseType,
  type GroupRequestPayload,
  groupRequestSchema,
} from "@/domain/group/schemas/group.schema";
import type { GroupFormErrors } from "@/domain/group/types/group.type";

// ===== 상수 =====

const INITIAL_FORM_STATE: GroupFormType = {
  name: "",
  description: "",
  members: [],
};

// ===== 타입 =====

interface UseGroupFormReturn {
  // 상태
  formState: GroupFormType;
  errors: GroupFormErrors;

  // 필드 변경
  setField: <Key extends keyof GroupFormType>(
    field: Key,
    value: GroupFormType[Key],
  ) => void;

  // 멤버 배열 조작
  setMembers: (members: string[]) => void;

  // 폼 제어
  /** 검증 후 성공 시 payload 반환, 실패 시 null 반환 */
  validate: () => GroupRequestPayload | null;
  reset: () => void;
  initializeForEdit: (data: GroupListResponseType) => void;
  initializeForCreate: () => void;
}

// ===== 유틸 함수 =====

/**
 * Zod 에러를 폼 에러 구조로 매핑
 */
function mapZodErrors(zodError: z.ZodError): GroupFormErrors {
  const entries = zodError.issues
    .filter((issue) => issue.path.length > 0)
    .map((issue) => [issue.path[0], issue.message]);

  return Object.fromEntries(entries) as GroupFormErrors;
}

/**
 * 서버 응답 데이터를 폼 상태로 변환
 */
function responseToFormState(data: GroupListResponseType): GroupFormType {
  return {
    name: data.name,
    description: data.description ?? "",
    members: [], // TODO: 서버에서 멤버 목록이 내려오면 매핑
  };
}

// ===== 훅 =====

/**
 * 그룹 폼 상태 및 검증 훅
 * - 순수 폼 상태 관리 + Zod 검증만 담당
 */
export function useGroupForm(): UseGroupFormReturn {
  // 폼 상태
  const [formState, setFormState] = useState<GroupFormType>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<GroupFormErrors>({});

  // ===== 필드 변경 =====

  const setField = <Key extends keyof GroupFormType>(
    field: Key,
    value: GroupFormType[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // 해당 필드 에러 클리어
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ===== 멤버 배열 조작 =====

  const setMembers = (members: string[]) => {
    setFormState((prev) => ({ ...prev, members }));
    // members 에러 클리어
    if (errors.members) {
      setErrors((prev) => ({ ...prev, members: undefined }));
    }
  };

  // ===== 폼 제어 =====

  /**
   * 폼 검증 - 성공 시 변환된 payload 반환, 실패 시 null 반환
   */
  const validate = (): GroupRequestPayload | null => {
    const result = groupRequestSchema.safeParse(formState);

    if (!result.success) {
      const mappedErrors = mapZodErrors(result.error);
      setErrors(mappedErrors);
      return null;
    }

    // 에러 클리어 및 검증된 payload 반환
    setErrors({});
    return result.data;
  };

  const reset = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  const initializeForEdit = (data: GroupListResponseType) => {
    setFormState(responseToFormState(data));
    setErrors({});
  };

  const initializeForCreate = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  return {
    // 상태
    formState,
    errors,

    // 필드 변경
    setField,

    // 멤버 배열 조작
    setMembers,

    // 폼 제어
    validate,
    reset,
    initializeForEdit,
    initializeForCreate,
  };
}
