/**
 * 페이지네이션된 테이블에서 행 번호를 계산합니다.
 *
 * @param page - 현재 페이지 (1부터 시작)
 * @param pageSize - 페이지당 항목 수
 * @param index - 현재 행의 인덱스 (0부터 시작)
 * @returns 전체 목록에서의 행 번호 (1부터 시작)
 *
 * @example
 * getTableRowNumber(1, 10, 0) // 1
 * getTableRowNumber(1, 10, 9) // 10
 * getTableRowNumber(2, 10, 0) // 11
 * getTableRowNumber(3, 5, 2) // 13
 */
export const getTableRowNumber = (
  page: number,
  pageSize: number,
  index: number,
): number => {
  return (page - 1) * pageSize + index + 1;
};
