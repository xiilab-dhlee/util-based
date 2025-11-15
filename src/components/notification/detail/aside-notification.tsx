"use client";

import styled from "styled-components";

// import { useAtomValue } from "jotai";

import {
  AsideDetailArticle,
  AsideDetailContainer,
} from "@/styles/layers/aside-detail-layers.styled";
// import { notificationSelectedAtom } from "@/atoms/notification/notification-list.atom";
// import { useGetNotification } from "@/hooks/notification/use-get-notification";
import {
  AsideListArticleHeader,
  AsideListArticleTitle,
} from "@/styles/layers/aside-list-layers.styled";

/**
 * AsideNotification 컴포넌트
 *
 * 알림 상세 정보를 사이드바에 탭 형태로 표시하는 컴포넌트입니다.
 * 알림의 기본 정보를 표시하며, 각 탭에 따라 적절한 하위 컴포넌트를 렌더링합니다.
 *
 * 주요 기능:
 * - 알림 기본 정보 헤더 표시 (아이콘 및 제목)
 * - 탭 기반 네비게이션 (기본 정보)
 * - 선택된 탭에 따른 동적 콘텐츠 렌더링
 * - 알림 정보 수정 컴포넌트 통합
 *
 * @returns 알림 상세 정보를 탭으로 구성한 사이드바 JSX 요소
 */
export function AsideNotification() {
  // const notificationSelected = useAtomValue(notificationSelectedAtom);

  // const { data } = useGetNotification(notificationSelected || "");

  return (
    <AsideDetailContainer>
      <AsideListArticleHeader>
        <AsideListArticleTitle>알림 설정</AsideListArticleTitle>
      </AsideListArticleHeader>
      <AsideDetailArticle>
        <ArticleKey>라이선스</ArticleKey>
      </AsideDetailArticle>
    </AsideDetailContainer>
  );
}


const ArticleKey = styled.div`
  flex: 1;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
`;

