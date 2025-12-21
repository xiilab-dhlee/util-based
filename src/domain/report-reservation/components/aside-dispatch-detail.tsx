"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import styled from "styled-components";

import { DISPATCH_RECIPIENT_TABLE_PAGE_SIZE } from "@/domain/report-reservation/constants/report-reservation.constant";
import { useGetDispatchDetail } from "@/domain/report-reservation/hooks/use-get-dispatch-detail";
import { createDispatchRecipientColumn } from "@/shared/components/column/create-dispatch-recipient-column";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";
import {
  AsideListArticleHeader,
  AsideListArticleTitle,
} from "@/styles/layers/aside-list-layers.styled";

/**
 * 발송 내역 상세 Aside 컴포넌트
 *
 * URL에 id가 있으면 상세 정보를 표시하고,
 * 없으면 에러 상태를 표시합니다.
 */
export function AsideDispatchDetail() {
  const params = useParams<{ id?: string }>();

  const dispatchId = params.id ?? "";
  const { data, isError, isLoading, refetch } =
    useGetDispatchDetail(dispatchId);

  // 수신 목록 컬럼
  const recipientColumns = useMemo(() => createDispatchRecipientColumn(), []);

  // URL에 id가 없는 경우 에러 상태 표시
  if (!params.id) {
    return (
      <AsideDetailContainer>
        <AsideListArticleHeader>
          <AsideListArticleTitle>발송 내역 상세 정보</AsideListArticleTitle>
        </AsideListArticleHeader>
        <FullWrapper>
          <EmptyState
            title="발송 내역 상세 정보"
            content="발송 내역 목록에서 항목을 선택해주세요."
          />
        </FullWrapper>
      </AsideDetailContainer>
    );
  }

  if (isError) {
    return (
      <AsideDetailContainer>
        <AsideDetailHeader>
          <AsideDetailHeaderTitle>발송 내역 상세 정보</AsideDetailHeaderTitle>
        </AsideDetailHeader>
        <FullWrapper>
          <DataErrorState onRetry={refetch} />
        </FullWrapper>
      </AsideDetailContainer>
    );
  }

  return (
    <AsideDetailContainer>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>발송 내역 상세 정보</AsideDetailHeaderTitle>
      </AsideDetailHeader>

      {/* 발송 내역 상세 정보 아티클 */}
      <ArticleWrapper>
        <AsideDetailArticle>
          <AsideDetailArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>
                  {data?.title ?? "-"}
                </AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              <StyledAsideDetailArticleColumn>
                <AsideDetailArticleKey>제목</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.title ?? "-"}
                </AsideDetailArticleValue>
              </StyledAsideDetailArticleColumn>

              <StyledAsideDetailArticleColumn>
                <AsideDetailArticleKey>종류</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.type ?? "-"}
                </AsideDetailArticleValue>
              </StyledAsideDetailArticleColumn>

              <StyledAsideDetailArticleColumn>
                <AsideDetailArticleKey>설명</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.description ?? "-"}
                </AsideDetailArticleValue>
              </StyledAsideDetailArticleColumn>
            </AsideDetailArticleItem>
          </AsideDetailArticleBody>
        </AsideDetailArticle>

        {/* 수신 목록 아티클 */}
        <AsideDetailArticle>
          <AsideDetailArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>수신 목록</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>
              <RecipientTableWrapper>
                <CustomizedTable
                  columns={recipientColumns}
                  data={data?.recipients ?? []}
                  pagination={{
                    pageSize: DISPATCH_RECIPIENT_TABLE_PAGE_SIZE,
                    showSizeChanger: false,
                  }}
                  activePadding
                  rowKey="email"
                  loading={isLoading}
                  isError={isError}
                />
              </RecipientTableWrapper>
            </AsideDetailArticleItem>
          </AsideDetailArticleBody>
        </AsideDetailArticle>
      </ArticleWrapper>
    </AsideDetailContainer>
  );
}

const FullWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow: auto;
`;

const RecipientTableWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const StyledAsideDetailArticleColumn = styled(AsideDetailArticleColumn)`
  align-items: flex-start;
`;
