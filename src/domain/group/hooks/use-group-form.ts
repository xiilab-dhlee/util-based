import { useCallback, useState } from "react";
import type { z } from "zod";

import {
  type GroupFormType,
  type GroupRequestPayload,
  groupRequestSchema,
} from "@/domain/group/schemas/group.schema";
import type { GroupFormErrors } from "@/domain/group/types/group.type";
import type { MemberRow } from "@/shared/components/column/create-member-column";
import type { GroupDetailResponseType } from "@/shared/schemas/group-tree.schema";

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
  /** 멤버 테이블 표시용 데이터 (id, name, email) */
  memberTableData: MemberRow[];

  // 필드 변경
  setField: <Key extends keyof GroupFormType>(
    field: Key,
    value: GroupFormType[Key],
  ) => void;

  // 멤버 관리 (테이블 데이터 + formState.members 동기화)
  setMemberTableData: (members: MemberRow[]) => void;
  removeMember: (id: string) => void;

  // 폼 제어
  /** 검증 후 성공 시 payload 반환, 실패 시 null 반환 */
  validate: () => GroupRequestPayload | null;
  reset: () => void;
  initializeForEdit: (data: GroupDetailResponseType) => void;
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
 * 그룹 상세 응답 데이터를 폼 상태로 변환
 */
function detailToFormState(data: GroupDetailResponseType): GroupFormType {
  return {
    name: data.groupName,
    description: data.description ?? "",
    members: data.users.map((user) => user.accountId),
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

  // ===== 멤버 테이블 데이터 (표시용) =====
  const [memberTableData, setMemberTableDataState] = useState<MemberRow[]>([]);

  /**
   * 멤버 테이블 데이터 설정 (formState.members도 동기화)
   */
  const setMemberTableData = useCallback((members: MemberRow[]) => {
    setMemberTableDataState(members);
    setFormState((prev) => ({ ...prev, members: members.map((m) => m.id) }));
    setErrors((prev) => ({ ...prev, members: undefined }));
  }, []);

  /**
   * 멤버 삭제 (테이블 + formState 동기화)
   */
  const removeMember = useCallback((id: string) => {
    setMemberTableDataState((prev) => prev.filter((m) => m.id !== id));
    setFormState((prev) => ({
      ...prev,
      members: prev.members.filter((memberId) => memberId !== id),
    }));
  }, []);

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

  const reset = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setMemberTableDataState([]);
    setErrors({});
  }, []);

  const initializeForEdit = useCallback((data: GroupDetailResponseType) => {
    setFormState(detailToFormState(data));
    // 멤버 테이블 데이터도 함께 초기화
    const members: MemberRow[] = data.users.map((user) => ({
      id: user.accountId,
      name: user.accountName,
      email: user.email,
    }));
    setMemberTableDataState(members);
    setErrors({});
  }, []);

  const initializeForCreate = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setMemberTableDataState([]);
    setErrors({});
  }, []);

  return {
    // 상태
    formState,
    errors,
    memberTableData,

    // 필드 변경
    setField,

    // 멤버 관리
    setMemberTableData,
    removeMember,

    // 폼 제어
    validate,
    reset,
    initializeForEdit,
    initializeForCreate,
  };
}
