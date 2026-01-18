import type { UIEvent } from "react";
import { useCallback } from "react";

interface UseDropdownInfiniteScrollParams {
  /** 다음 페이지 존재 여부 */
  hasNextPage: boolean;
  /** 다음 페이지 로딩 중 여부 */
  isFetchingNextPage: boolean;
  /** 다음 페이지 호출 함수 */
  fetchNextPage: () => void;
  /** 스크롤 끝에서 트리거할 거리 (px), 기본값 50 */
  threshold?: number;
}

interface UseDropdownInfiniteScrollReturn {
  /** 드롭다운/셀렉트 팝업 스크롤 핸들러 */
  handlePopupScroll: (e: UIEvent<HTMLDivElement>) => void;
}

/**
 * 드롭다운/셀렉트 컴포넌트의 무한 스크롤 핸들러 훅
 *
 * 드롭다운 팝업 내부 스크롤이 끝에 가까워지면 자동으로 다음 페이지를 호출합니다.
 * antd Select, xiilab-ui Dropdown 등의 onPopupScroll prop에 사용됩니다.
 *
 * @example
 * const { handlePopupScroll } = useDropdownInfiniteScroll({
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage,
 * });
 *
 * // xiilab-ui Dropdown
 * <Dropdown onPopupScroll={handlePopupScroll} />
 *
 * // antd Select
 * <Select onPopupScroll={handlePopupScroll} />
 */
export function useDropdownInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 50,
}: UseDropdownInfiniteScrollParams): UseDropdownInfiniteScrollReturn {
  const handlePopupScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const isNearBottom =
        target.scrollTop + target.clientHeight >=
        target.scrollHeight - threshold;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, threshold],
  );

  return {
    handlePopupScroll,
  };
}
