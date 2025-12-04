/**
 * 분자/분모를 퍼센트(0~100) 값으로 변환합니다.
 * - 분모가 0이거나 유효하지 않으면 0을 반환합니다.
 * - 소수 자릿수를 지정해 반올림합니다.
 *
 * @param numerator - 분자 값
 * @param denominator - 분모 값
 * @param decimals - 소수 자릿수 (기본값: 0, 음수면 0으로 처리)
 * @returns 퍼센트 값 (0 ~ 100)
 */
export function getPercent(
  numerator: number,
  denominator: number,
  decimals = 0,
): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return 0;
  }

  const rawPercent = (numerator / denominator) * 100;
  const safeDecimals = Math.min(
    Math.max(Math.floor(decimals || 0), 0),
    100,
  );

  const roundedPercent =
    safeDecimals === 0
      ? Math.round(rawPercent)
      : Number(rawPercent.toFixed(safeDecimals));

  const clampedPercent = Math.min(Math.max(roundedPercent, 0), 100);

  return clampedPercent;
}


