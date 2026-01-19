/**
 * 워크스페이스 이름 검증용 패턴
 * - 영문/숫자/한글(자모 포함)/대시/언더스코어 허용
 */
export const WORKSPACE_NAME_PATTERN =
  /^[a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\-_]+$/;
