import { expect } from "@playwright/test";

// ============================================================================
// Types
// ============================================================================

/**
 * 테스트 검증 로거 타입
 *
 * 테스트 결과를 콘솔에 출력하면서 검증을 수행합니다.
 * 검증 성공/실패 여부를 아이콘으로 표시하고, 기대값/실제값을 함께 출력합니다.
 */
export type AssertLogger = {
  /** 값이 정확히 일치하는지 검증 */
  assertEqual: <T>(label: string, actual: T, expected: T) => void;
  /** 값이 유효한 값 목록에 포함되는지 검증 */
  assertContains: <T>(label: string, actual: T, validValues: T[]) => void;
  /** 문자열이 비어있지 않은지 검증 (빈 문자열, "-" 모두 실패) */
  assertNotEmpty: (label: string, actual: string | null | undefined) => void;
  /** 문자열이 정규식 패턴과 일치하는지 검증 */
  assertMatch: (label: string, actual: string, pattern: RegExp) => void;
  /** 조건이 참인지 검증 */
  assertTrue: (label: string, condition: boolean) => void;
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 검증 결과를 콘솔에 출력
 *
 * @param label - 검증 항목 라벨
 * @param actual - 실제 값
 * @param expected - 기대 값
 * @param passed - 검증 통과 여부
 */
function logAssertion(
  label: string,
  actual: unknown,
  expected: unknown,
  passed: boolean,
) {
  const icon = passed ? "✓" : "✗";
  console.log(
    `  ${icon} ${label} (기대값: ${JSON.stringify(expected)}, 실제값: ${JSON.stringify(actual)})`,
  );
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * AssertLogger 인스턴스 생성
 *
 * @returns AssertLogger 인스턴스
 *
 * @example
 * const assertLogger = createAssertLogger();
 *
 * // 값 비교
 * assertLogger.assertEqual("상태", status, "RUNNING");
 *
 * // 유효값 목록 검증
 * assertLogger.assertContains("잡 타입", jobType, ["BATCH", "INTERACTIVE"]);
 *
 * // 비어있지 않음 검증 (UI에서 "-"도 빈 값으로 취급)
 * assertLogger.assertNotEmpty("워크로드 이름", name);
 *
 * // 정규식 패턴 검증
 * assertLogger.assertMatch("생성일", createdAt, /\d{4}-\d{2}-\d{2}/);
 *
 * // 조건 검증
 * assertLogger.assertTrue("로딩 완료", isLoaded);
 */
export function createAssertLogger(): AssertLogger {
  return {
    assertEqual: <T>(label: string, actual: T, expected: T) => {
      logAssertion(label, actual, expected, actual === expected);
      expect(actual).toBe(expected);
    },

    assertContains: <T>(label: string, actual: T, validValues: T[]) => {
      logAssertion(
        label,
        actual,
        `one of [${validValues.join(", ")}]`,
        validValues.includes(actual),
      );
      expect(validValues).toContain(actual);
    },

    assertNotEmpty: (label: string, actual: string | null | undefined) => {
      const trimmed = actual?.trim() ?? "";
      // 빈 문자열과 "-"(UI에서 빈 값 표시)를 모두 유효하지 않은 값으로 취급
      const isValid = trimmed.length > 0 && trimmed !== "-";
      logAssertion(label, actual, "non-empty string (not '-')", isValid);
      expect(isValid).toBe(true);
    },

    assertMatch: (label: string, actual: string, pattern: RegExp) => {
      logAssertion(label, actual, pattern.toString(), pattern.test(actual));
      expect(actual).toMatch(pattern);
    },

    assertTrue: (label: string, condition: boolean) => {
      logAssertion(label, condition, true, condition);
      expect(condition).toBe(true);
    },
  };
}
