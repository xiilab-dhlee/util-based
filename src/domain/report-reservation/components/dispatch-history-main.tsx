"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { DispatchHistoryListBody } from "@/domain/report-reservation/components/dispatch-history-list-body";
import { DispatchHistoryListFooter } from "@/domain/report-reservation/components/dispatch-history-list-footer";
import { DISPATCH_HISTORY_LIST_PAGE_SIZE } from "@/domain/report-reservation/constants/report-reservation.constant";
import { useGetDispatchHistories } from "@/domain/report-reservation/hooks/use-get-dispatch-histories";
import { dispatchHistoryPageAtom } from "@/domain/report-reservation/state/dispatch-history.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

/**
 * 발송 내역 메인 컴포넌트
 *
 * 발송 내역 섹션에 들어갈 컴포넌트들을 렌더링합니다.
 * 필터, 테이블, 페이지네이션을 포함합니다.
 */
export function DispatchHistoryMain() {
  const [page, setPage] = useAtom(dispatchHistoryPageAtom);

  const { data, isLoading } = useGetDispatchHistories({
    page,
    size: DISPATCH_HISTORY_LIST_PAGE_SIZE,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container>
      <MySearchFilter title="발송 내역" total={data?.totalSize} />
      <DispatchHistoryListBody
        data={data?.content || []}
        isLoading={isLoading}
      />
      <DispatchHistoryListFooter
        total={data?.totalSize || 0}
        page={page}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}

const Container = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
