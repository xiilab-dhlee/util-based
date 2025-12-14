import { DISPATCH_HISTORY_LIST_PAGE_SIZE } from "@/domain/report-reservation/constants/report-reservation.constant";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface DispatchHistoryListFooterProps {
  total: number;
  page: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

/**
 * 발송 내역 목록 페이지 하단 푸터 컴포넌트
 *
 * 발송 내역 목록 페이지에서 페이지 번호를 관리하고,
 * 총 발송 내역 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param total - 총 발송 내역 수
 * @param page - 현재 페이지 번호
 * @param isLoading - 로딩 상태
 * @param onPageChange - 페이지 변경 핸들러
 * @returns 발송 내역 목록 페이지 하단 푸터 컴포넌트
 */
export function DispatchHistoryListFooter({
  total,
  page,
  isLoading,
  onPageChange,
}: DispatchHistoryListFooterProps) {
  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={DISPATCH_HISTORY_LIST_PAGE_SIZE}
      onChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
