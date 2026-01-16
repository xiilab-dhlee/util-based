"use client";

import styled from "styled-components";

import { useFindHubDetail } from "@/api/generated/hub/hub";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MarkdownToHtml } from "@/shared/components/markdown-to-html";
import { MySpinner } from "@/shared/components/spinner";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { HUB_SELECTOR } from "@/shared/constants/selector.constant";
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
    return (
      <Container>
        <MySpinner />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <EmptyState title={TABLE_MESSAGE.ERROR} />
      </Container>
    );
  }

  return (
    <Container data-testid={HUB_SELECTOR.DETAIL_README}>
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
