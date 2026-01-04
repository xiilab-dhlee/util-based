/**
 * E2E 테스트 공용 헬퍼 함수
 *
 * Page Object와 Modal에서 공통으로 사용되는 유틸리티 함수 모음
 *
 * @example
 * import { generateRandomText } from "../support/test-helpers";
 *
 * const randomName = generateRandomText(10);
 */

/**
 * 지정된 길이의 랜덤 테스트용 문자열 생성
 *
 * maxLength 검증 등에 활용
 * 한글, 영문 대소문자, 숫자를 포함
 *
 * @param length - 생성할 문자열 길이
 * @returns 지정된 길이의 랜덤 문자열
 *
 * @example
 * generateRandomText(10) // "aB3xKp9mZq"
 * generateRandomText(51) // 51자 문자열 (maxLength 초과 테스트용)
 */
export function generateRandomText(length: number): string {
  if (length <= 0) return "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789가나다라마바사아자차카타파하";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
