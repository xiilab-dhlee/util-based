"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { ViewHubReadme } from "@/domain/hub/components/detail/view-hub-readme";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { HUB_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

export function HubDetailMain() {
  const publish = usePublish();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const hubId = Number(params.id);
  const hubName = searchParams.get("name") || "";

  const handleCreateWorkload = () => {
    publish(WORKLOAD_EVENTS.sendCreateWorkload, {
      image: {
        type: "HUB",
        id: hubId,
      },
    });
  };

  // 유효하지 않은 Hub ID 체크
  if (!params.id || Number.isNaN(hubId)) {
    return (
      <Container>
        <EmptyState title="유효하지 않은 Hub ID입니다." />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <AsideDetailHeaderTitle>
          <span data-testid={HUB_SELECTOR.DETAIL_NAME}>{hubName}</span>
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
          data-testid={HUB_SELECTOR.CREATE_WORKLOAD_BUTTON}
        >
          워크로드 생성
        </Button>
      </Header>
      {/* 허브 README 콘텐츠 영역: 스크롤 가능한 마크다운 렌더링 */}
      <ViewHubReadme hubId={hubId} />
    </Container>
  );
}

const Container = styled(AsideDetailContainer)`
`;

const Header = styled(AsideDetailHeader)`
  height: 30px;
  margin-bottom: 14px;
`;
