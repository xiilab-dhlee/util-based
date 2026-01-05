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

const Container = styled(AsideDetailArticle)`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;
