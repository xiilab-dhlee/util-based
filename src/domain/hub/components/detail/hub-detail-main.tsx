"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { ViewHubReadme } from "@/domain/hub/components/detail/view-hub-readme";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { HUB_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateWorkloadDrawerAtom } from "@/shared/state/modal.atom";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

export function HubDetailMain() {
  const { onOpen } = useGlobalModal(openCreateWorkloadDrawerAtom);
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const hubId = Number(params.id);
  const hubName = searchParams.get("name") || "";

  const handleCreateWorkload = () => {
    // TODO: Hub 이미지 정보를 atom에 설정해야 함
    // 현재는 drawer만 열기
    onOpen();
  };

  // 유효하지 않은 Hub ID 체크
  if (!params.id || Number.isNaN(hubId)) {
    return (
      <AsideDetailContainer>
        <EmptyState title="유효하지 않은 Hub ID입니다." />
      </AsideDetailContainer>
    );
  }

  return (
    <AsideDetailContainer>
      <StyledAsideDetailHeader>
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
      </StyledAsideDetailHeader>
      {/* 허브 README 콘텐츠 영역: 스크롤 가능한 마크다운 렌더링 */}
      <ViewHubReadme hubId={hubId} />
    </AsideDetailContainer>
  );
}

const StyledAsideDetailHeader = styled(AsideDetailHeader)`
  height: 30px;
  margin-bottom: 14px;
`;
