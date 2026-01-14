"use client";

import { isBoolean } from "es-toolkit";
import styled from "styled-components";
import { Tag } from "xiilab-ui";

import { useGetAccountDetail } from "@/api/generated/admin-account/admin-account";
import { getAccountStatusLabelFromBoolean } from "@/domain/account-management/constants/account.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRow,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

interface AccountDetailPanelProps {
  accountId: string;
}

export function AccountDetailPanel({ accountId }: AccountDetailPanelProps) {
  const { data: accountDetail, isError } = useGetAccountDetail(accountId);

  if (isError) {
    return (
      <PanelContainer>
        <AsideDetailHeader>
          <AsideDetailHeaderTitle>계정 정보</AsideDetailHeaderTitle>
        </AsideDetailHeader>
        <FullWrapper>
          <DataErrorState />
        </FullWrapper>
      </PanelContainer>
    );
  }

  const displayEmail = accountDetail?.email ?? "-";
  const displayName = accountDetail?.accountName ?? "-";
  const displayRole = accountDetail?.accountRole ?? "-";
  const isEnabled = accountDetail?.isEnabled;
  const displayStatus = isBoolean(isEnabled)
    ? getAccountStatusLabelFromBoolean(isEnabled)
    : "-";
  const displayJoinedDate = formatDateSafely(accountDetail?.createdAt) ?? "-";

  const groupNames = accountDetail?.groupName ?? [];

  return (
    <PanelContainer>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>계정 정보</AsideDetailHeaderTitle>
      </AsideDetailHeader>

      <PanelBody>
        <AsideDetailArticle>
          <AsideDetailArticleHeader>
            <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
          </AsideDetailArticleHeader>
          <AsideDetailArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleRow>
                <AsideDetailArticleRowItem>
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>이메일</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayEmail}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>이름</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayName}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>상태</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayStatus}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                </AsideDetailArticleRowItem>
                <AsideDetailArticleRowItem>
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>권한</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayRole}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>가입일</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayJoinedDate}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                </AsideDetailArticleRowItem>
              </AsideDetailArticleRow>
            </AsideDetailArticleItem>
          </AsideDetailArticleBody>
        </AsideDetailArticle>

        <ArticleGap>
          <AsideDetailArticleHeader>
            <AsideDetailArticleTitle>워크스페이스</AsideDetailArticleTitle>
          </AsideDetailArticleHeader>
          <AsideDetailArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>보유 개수</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {typeof accountDetail?.workspaceCount === "number"
                    ? `${accountDetail.workspaceCount}개`
                    : "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>생성 제한 개수</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {typeof accountDetail?.workspaceLimitCount === "number"
                    ? `${accountDetail.workspaceLimitCount}개`
                    : "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
            </AsideDetailArticleItem>
            <AsideDetailArticleItem>
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>그룹 목록</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {groupNames.length > 0 ? (
                    <TagList>
                      {groupNames.map((groupName, index) => (
                        <Tag
                          key={`${groupName}-${index}`}
                          variant="gray"
                          maxWidth="100%"
                        >
                          {groupName}
                        </Tag>
                      ))}
                    </TagList>
                  ) : (
                    "-"
                  )}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
            </AsideDetailArticleItem>
          </AsideDetailArticleBody>
        </ArticleGap>
      </PanelBody>
    </PanelContainer>
  );
}

export const PanelContainer = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  --column-gutter-size: 20px;
`;

const PanelBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ArticleGap = styled(AsideDetailArticle)`
  margin-top: 10px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FullWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
