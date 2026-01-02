/* API 요청 관련 타입 */

// 페이지네이션 타입
export interface CorePaginate {
  page: number;
  size: number;
}

// 검색 텍스트 타입
export interface CoreSearchText {
  searchText?: string;
}

// 정렬 타입
export type SortDirection = "ASC" | "DESC";

export interface CoreSort {
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface CorePayload {
  [key: string]: string | number | boolean | undefined | Array<unknown>; // 인덱스 시그니처 추가
}
