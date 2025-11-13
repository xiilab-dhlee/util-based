/**
 * 검증 결과 인터페이스
 */
export interface ValidationResult<T = any> {
  isValid: boolean;
  errors: ValidationError[];
  data: T;
}

/**
 * 검증 에러 인터페이스
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

/**
 * 검증 규칙 인터페이스
 */
export interface ValidationRule<T = any> {
  field: keyof T;
  validator: (value: any) => string | null;
  message?: string;
}

/**
 * 검증 옵션 인터페이스
 */
export interface ValidationOptions {
  stopOnFirstError?: boolean;
  includeEmptyFields?: boolean;
}
