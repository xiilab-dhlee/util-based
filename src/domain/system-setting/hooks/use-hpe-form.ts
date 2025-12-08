import { useCallback, useState } from "react";
import type { ZodError } from "zod";

import type {
  HpeFormErrors,
  HpeFormType,
  UpdateHpeRequestType,
} from "@/domain/system-setting/schemas/hpe.schema";
import { hpeFormSchema } from "@/domain/system-setting/schemas/hpe.schema";

/**
 * HPE 폼 상태 관리 훅
 * @returns 폼 상태, 에러, 검증 함수
 */
export const useHpeForm = () => {
  const [formState, setFormState] = useState<HpeFormType>({
    id: "",
    password: "",
    serverIp: "",
  });

  const [errors, setErrors] = useState<HpeFormErrors>({});

  /**
   * 개별 필드 값 설정
   */
  const setField = useCallback((field: keyof HpeFormType, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // 필드 변경 시 해당 필드 에러 제거
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  /**
   * 전체 폼 검증
   * @returns 검증 성공 시 요청 데이터, 실패 시 null
   */
  const validate = useCallback((): UpdateHpeRequestType | null => {
    try {
      const validatedData = hpeFormSchema.parse(formState);
      setErrors({});
      return {
        id: validatedData.id,
        password: validatedData.password,
        serverIp: validatedData.serverIp,
      };
    } catch (error) {
      if (error instanceof Error && "errors" in error) {
        const zodError = error as ZodError;
        const fieldErrors: HpeFormErrors = {};
        zodError.errors.forEach((err) => {
          const field = err.path[0] as keyof HpeFormType;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return null;
    }
  }, [formState]);

  /**
   * 폼 초기화
   */
  const reset = useCallback(() => {
    setFormState({ id: "", password: "", serverIp: "" });
    setErrors({});
  }, []);

  /**
   * 기존 데이터로 폼 초기화 (수정 모드)
   */
  const setInitialData = useCallback(
    (data: { id: string; serverIp: string }) => {
      setFormState((prev) => ({
        ...prev,
        id: data.id,
        serverIp: data.serverIp,
        password: "", // 비밀번호는 항상 새로 입력
      }));
      setErrors({});
    },
    [],
  );

  return { formState, errors, setField, validate, reset, setInitialData };
};
