"use client";

import { useAtomCallback } from "jotai/utils";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { useFindHubImage } from "@/api/generated/hub/hub";
import { ViewHubReadme } from "@/domain/hub/components/detail/view-hub-readme";
import { WORKLOAD_IMAGE_TYPES } from "@/domain/workload/constants/workload.constant";
import {
  harborImageNameAtom,
  imageTagNameAtom,
  imageTypeAtom,
} from "@/domain/workload/state/create-workload.atom";
import { resetAllWorkloadAtoms } from "@/domain/workload/utils/reset-workload-atoms";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { HUB_SELECTOR } from "@/shared/constants/selector.constant";
import { openCreateWorkloadDrawerAtom } from "@/shared/state/modal.atom";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

export function HubDetailMain() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const hubId = Number(params.id);
  const hubName = searchParams.get("name") || "";

  const { data: hubImageData, isLoading: isHubImageLoading } = useFindHubImage(
    hubId,
    {
      query: {
        enabled: !Number.isNaN(hubId),
      },
    },
  );

  const handleCreateWorkload = useAtomCallback(
    useCallback(
      (_get, set) => {
        if (isHubImageLoading) {
          return;
        }

        const harborImageName = hubImageData?.harborImageName?.trim();
        const tagName = hubImageData?.tagName?.trim();

        if (!harborImageName || !tagName) {
          toast.error("허브 복제 데이터를 가져오는데 실패했습니다.");
          return;
        }

        resetAllWorkloadAtoms(set);
        set(harborImageNameAtom, harborImageName);
        set(imageTagNameAtom, tagName);
        set(imageTypeAtom, WORKLOAD_IMAGE_TYPES.HUB);
        set(openCreateWorkloadDrawerAtom, true);
      },
      [hubImageData, isHubImageLoading],
    ),
  );

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
          disabled={isHubImageLoading}
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
