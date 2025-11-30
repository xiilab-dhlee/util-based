"use client";

import { useGetAccountDetail } from "@/domain/account-management/hooks/use-get-account-detail";
import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  Article,
  ArticleBody,
  ArticleKey,
  ArticlePane,
  ArticleRecord,
  ArticleTitle,
  ArticleValue,
  PanelBody,
  PanelContainer,
  PanelHeader,
  PanelTitle,
  Tag,
} from "./detail-panel.styled";

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
  const displayName = accountDetail?.name ?? account.name;
  const displayRole = accountDetail?.role ?? "USER";
  const displayStatus =
    typeof accountDetail?.isEnabled === "boolean"
      ? accountDetail.isEnabled
        ? "활성화"
        : "비활성화"
      : "-";
  const displayJoinedDate = formatDateSafely(accountDetail?.createdAt);

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>계정 정보</PanelTitle>
      </PanelHeader>

      <PanelBody>
        <Article>
          <ArticleTitle>기본 정보</ArticleTitle>
          <ArticleBody>
            {/* 좌측 컬럼 */}
            <ArticlePane>
              <ArticleRecord>
                <ArticleKey>아이디</ArticleKey>
                <ArticleValue>{displayId}</ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>이름</ArticleKey>
                <ArticleValue>{displayName}</ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>상태</ArticleKey>
                <ArticleValue>{displayStatus}</ArticleValue>
              </ArticleRecord>
            </ArticlePane>
            {/* 우측 컬럼 */}
            <ArticlePane>
              <ArticleRecord>
                <ArticleKey>권한</ArticleKey>
                <ArticleValue>{displayRole}</ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>가입일</ArticleKey>
                <ArticleValue>{displayJoinedDate || "-"}</ArticleValue>
              </ArticleRecord>
            </ArticlePane>
          </ArticleBody>
        </Article>

        {/* 워크스페이스 / 그룹 정보 (Figma 기준 추가 카드) */}
        <Article>
          <ArticleTitle>워크스페이스</ArticleTitle>
          <ArticleBody>
            <ArticlePane>
              <ArticleRecord>
                <ArticleKey>보유 개수</ArticleKey>
                <ArticleValue>
                  {typeof accountDetail?.workspaceCount === "number"
                    ? `${accountDetail.workspaceCount}개`
                    : "-"}
                </ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>생성 제한 개수</ArticleKey>
                <ArticleValue>
                  {typeof accountDetail?.workspaceLimitCount === "number"
                    ? `${accountDetail.workspaceLimitCount}개`
                    : "-"}
                </ArticleValue>
              </ArticleRecord>
            </ArticlePane>
          </ArticleBody>
          <ArticleBody>
            <ArticlePane>
              <ArticleRecord>
                <ArticleKey>그룹 목록</ArticleKey>
                <ArticleValue>
                  {/* TODO: 그룹이 다수인 구조로 변경되면 배열로 확장 필요 */}
                  {accountDetail?.group ? (
                    <Tag>{accountDetail.group}</Tag>
                  ) : (
                    "-"
                  )}
                </ArticleValue>
              </ArticleRecord>
            </ArticlePane>
          </ArticleBody>
        </Article>
      </PanelBody>
    </PanelContainer>
  );
}
