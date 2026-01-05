"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { ViewHubReadme } from "@/domain/hub/components/detail/view-hub-readme";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

export function HubDetailMain() {
  const params = useParams<{ id: string }>();
  const hubId = Number(params.id);
  const publish = usePublish();

  const handleCreateWorkload = () => {
    publish(WORKLOAD_EVENTS.sendCreateWorkload, {
      image: {
        type: "HUB",
        id: hubId,
      },
    });
  };

  return (
    <Container>
      <Header>
        <AsideDetailHeaderTitle>
          <span>TODO: Hub 이름 연동 필요</span>
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
