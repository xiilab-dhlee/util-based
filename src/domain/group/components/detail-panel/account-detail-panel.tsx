"use client";

import styled from "styled-components";
import { Tag } from "xiilab-ui";

import { useGetAccountDetail } from "@/api/generated/admin-account/admin-account";
import { getAccountStatusLabelFromBoolean } from "@/domain/account-management/constants/account.constant";
import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
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
  /** 선택된 계정 노드 */
  account: GroupTreeType;
}

/**
 * 계정 상세 정보 패널
 *
 * 선택된 계정의 상세 정보를 표시합니다.
 */
export function AccountDetailPanel({ account }: AccountDetailPanelProps) {
  // 계정 상세 정보는 account 도메인 API를 통해 별도로 조회
  const { data: accountDetail } = useGetAccountDetail(account.id);

  const displayId = accountDetail?.email ?? "-";
  const displayName = accountDetail?.accountName ?? "-";
  const displayRole = accountDetail?.accountRole ?? "-";
  const displayStatus =
    typeof accountDetail?.isEnabled === "boolean"
      ? getAccountStatusLabelFromBoolean(accountDetail.isEnabled)
      : "-";
  const displayJoinedDate = formatDateSafely(accountDetail?.createdAt) ?? "-";

  // 상세 응답에서 제공되는 그룹 이름 목록 (문자열 배열)
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
                {/* 좌측 컬럼 */}
                <AsideDetailArticleRowItem>
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>아이디</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {displayId}
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
                {/* 우측 컬럼 */}
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

        {/* 워크스페이스 / 그룹 정보 */}
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
                        <Tag key={index} variant="gray">
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

// ===== Local Styled Components =====

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
