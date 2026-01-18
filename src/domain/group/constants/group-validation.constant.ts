/**
 * 그룹 이름 검증용 패턴
 * - 영문/숫자/한글(자모 포함)/대시/언더스코어/닷/공백 허용
 */
export const GROUP_NAME_PATTERN =
  /^[a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\-_. ]+$/;

export const GROUP_NAME_MAX_LENGTH = 25;
export const GROUP_DESCRIPTION_MAX_LENGTH = 255;
