"use client";

import styled from "styled-components";

import { useFindHubDetail } from "@/api/generated/hub/hub";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { MarkdownToHtml } from "@/shared/components/markdown-to-html";
import { MySpinner } from "@/shared/components/spinner";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
} from "@/styles/layers/aside-detail-layers.styled";

interface ViewHubReadmeProps {
  hubId: number;
}

export function ViewHubReadme({ hubId }: ViewHubReadmeProps) {
  const { data, isLoading, isError } = useFindHubDetail(hubId);

  if (isLoading) {
    return <MySpinner />;
  }

  if (isError) {
    return (
      <Container>
        <ListEmpty
          title="조회 중 오류가 발생했습니다."
          message="잠시 후 다시 시도해 주세요."
        />
      </Container>
    );
  }

  return (
    <Container>
      <AsideDetailArticleBody>
        <MarkdownToHtml markdown={data || ""} />
      </AsideDetailArticleBody>
    </Container>
  );
}

/**
 * 스크롤 가능한 콘텐츠 영역을 위한 스타일드 컴포넌트
 * - flex: 1: 남은 공간을 모두 차지
 * - overflow-y: auto: 세로 스크롤 활성화 (콘텐츠가 길 때)
 */
const Container = styled(AsideDetailArticle)`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;
