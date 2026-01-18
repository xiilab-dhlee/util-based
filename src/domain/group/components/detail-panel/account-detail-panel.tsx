"use client";

import { isBoolean } from "es-toolkit";
import styled from "styled-components";
import { Tag, Typography } from "xiilab-ui";

import { useGetAccountDetail } from "@/api/generated/admin-account-management/admin-account-management";
import { getAccountStatusLabelFromBoolean } from "@/domain/account-management/constants/account.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { ACCOUNT_ROLE_LABEL } from "@/shared/constants/core.constant";
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
} from "@/styles/layers/aside-detail-layers.styled";

interface AccountDetailPanelProps {
  accountId: string;
}

interface GroupNameTagListProps {
  groupNames: string[];
}

function GroupNameTagList({ groupNames }: GroupNameTagListProps) {
  if (groupNames.length === 0) {
    return "-";
  }

  return (
    <TagList>
      {groupNames.map((groupName, index) => (
        <Tag key={`${groupName}-${index}`} variant="gray" maxWidth="100%">
          {groupName}
        </Tag>
      ))}
    </TagList>
  );
}

export function AccountDetailPanel({ accountId }: AccountDetailPanelProps) {
  const { data: accountDetail, isError } = useGetAccountDetail(accountId);

  if (isError) {
    return (
      <PanelContainer>
        <AsideDetailHeader>
          <Typography.Text variant="subtitle-2-1">계정 정보</Typography.Text>
        </AsideDetailHeader>
        <FullWrapper>
          <DataErrorState />
        </FullWrapper>
      </PanelContainer>
    );
  }

  const displayEmail = accountDetail?.email || "-";
  const displayName = accountDetail?.accountName || "-";

  const accountRole = accountDetail?.accountRole;
  const displayRole = accountRole
    ? (ACCOUNT_ROLE_LABEL[accountRole] ?? accountRole)
    : "-";
  const isEnabled = accountDetail?.isEnabled;
  const displayStatus = isBoolean(isEnabled)
    ? getAccountStatusLabelFromBoolean(isEnabled)
    : "-";
  const displayJoinedDate = formatDateSafely(accountDetail?.createdAt) ?? "-";

  const groupNames = accountDetail?.groupName || [];

  return (
    <PanelContainer>
      <AsideDetailHeader>
        <Typography.Text variant="subtitle-2-1">계정 정보</Typography.Text>
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
                  <DetailColumn>
                    <AsideDetailArticleKey>이메일</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayEmail}
                    </AsideDetailArticleValue>
                  </DetailColumn>
                  <DetailColumn>
                    <AsideDetailArticleKey>이름</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayName}
                    </AsideDetailArticleValue>
                  </DetailColumn>
                  <DetailColumn>
                    <AsideDetailArticleKey>상태</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayStatus}
                    </AsideDetailArticleValue>
                  </DetailColumn>
                </AsideDetailArticleRowItem>
                <AsideDetailArticleRowItem>
                  <DetailColumn>
                    <AsideDetailArticleKey>권한</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayRole}
                    </AsideDetailArticleValue>
                  </DetailColumn>
                  <DetailColumn>
                    <AsideDetailArticleKey>가입일</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayJoinedDate}
                    </AsideDetailArticleValue>
                  </DetailColumn>
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
              <DetailColumn>
                <AsideDetailArticleKey>보유 개수</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {typeof accountDetail?.workspaceCount === "number"
                    ? `${accountDetail.workspaceCount}개`
                    : "-"}
                </AsideDetailArticleValue>
              </DetailColumn>
              <DetailColumn>
                <AsideDetailArticleKey>생성 제한 개수</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {typeof accountDetail?.workspaceLimitCount === "number"
                    ? `${accountDetail.workspaceLimitCount}개`
                    : "-"}
                </AsideDetailArticleValue>
              </DetailColumn>
            </AsideDetailArticleItem>
            <AsideDetailArticleItem>
              <DetailColumn>
                <AsideDetailArticleKey>그룹 목록</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  <GroupNameTagList groupNames={groupNames} />
                </AsideDetailArticleValue>
              </DetailColumn>
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
  background-color: #FAFAFA;
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

const DetailColumn = styled(AsideDetailArticleColumn)`
  align-items: flex-start;
`;

const FullWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
