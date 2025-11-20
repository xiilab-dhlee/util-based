"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { useGetHub } from "@/domain/hub/hooks/use-get-hub";
import { hubSelectedAtom } from "@/domain/hub/state/hub.atom";
import { MarkdownToHtml } from "@/shared/components/markdown-to-html";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * AsideHub 컴포넌트
 *
 * 허브 상세 정보를 사이드바에 표시하는 컴포넌트입니다.
 * 선택된 허브의 README 문서를 마크다운 형태로 렌더링하여 표시하며,
 * 워크로드 생성 버튼을 통해 해당 허브를 기반으로 한 워크로드를 생성할 수 있습니다.
 *
 * 주요 기능:
 * - 선택된 허브의 상세 정보 표시
 * - 허브 README 문서를 마크다운으로 렌더링
 * - 워크로드 생성 버튼 제공 (현재 준비 중 상태)
 * - 스크롤 가능한 콘텐츠 영역
 *
 * 상태 관리:
 * - hubSelectedAtom: 현재 선택된 허브 정보
 * - useGetHub: 선택된 허브의 상세 데이터 조회
 *
 * @returns 허브 상세 정보를 표시하는 사이드바 JSX 요소
 */
export function AsideHub() {
  // 현재 선택된 허브 정보를 Jotai atom에서 가져옴
  const selectedHub = useAtomValue(hubSelectedAtom);

  // 선택된 허브의 상세 데이터를 React Query로 조회
  const { data } = useGetHub(selectedHub);

  /**
   * 워크로드 생성 버튼 클릭 핸들러
   * 현재는 준비 중 상태로 알림만 표시
   * 향후 허브 기반 워크로드 생성 모달 또는 페이지로 이동 예정
   */
  const handleCreateWorkload = () => {
    alert("준비 중입니다.");
  };

  return (
    <AsideDetailContainer>
      {/* 허브 헤더 영역: 제목과 워크로드 생성 버튼 */}
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>
          <span>{data?.title}</span>
        </AsideDetailHeaderTitle>
        <Button
          color="primary"
          icon="Plus"
          iconPosition="left"
          iconSize={20}
          variant="gradient"
          width={120}
          height={30}
          onClick={handleCreateWorkload}
        >
          워크로드 생성
        </Button>
      </AsideDetailHeader>

      {/* 허브 README 콘텐츠 영역: 스크롤 가능한 마크다운 렌더링 */}
      <FillArticle>
        <AsideDetailArticleBody>
          <MarkdownToHtml markdown={data?.readme || ""} />
        </AsideDetailArticleBody>
      </FillArticle>
    </AsideDetailContainer>
  );
}

/**
 * 스크롤 가능한 콘텐츠 영역을 위한 스타일드 컴포넌트
 * - flex: 1: 남은 공간을 모두 차지
 * - overflow-y: auto: 세로 스크롤 활성화 (콘텐츠가 길 때)
 */
const FillArticle = styled(AsideDetailArticle)`
  flex: 1;
  overflow-y: auto;
`;
