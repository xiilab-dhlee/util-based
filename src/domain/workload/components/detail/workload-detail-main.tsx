"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Button } from "xiilab-ui";

import { useGetWorkloadDetail } from "@/api/generated/workload/workload";
import { CreateDirectSnapshotImageModal } from "@/domain/workload/components/create-direct-snapshot-image-modal";
import { WorkloadPrimaryArticle } from "@/domain/workload/components/detail/workload-primary-article";
import { WorkloadSecondaryArticle } from "@/domain/workload/components/detail/workload-secondary-article";
import { UpdateWorkloadPresetModal } from "@/domain/workload/components/update-workload-preset-modal";
import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { MySpinner } from "@/shared/components/spinner";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

export function WorkloadDetailMain() {
  const publish = usePublish();

  const pathname = usePathname();

  const { id } = useParams();
  const searchParams = useSearchParams();

  const workspaceId = Number(searchParams?.get("workspaceId"));
  const workloadId = String(id);

  const { data, isLoading } = useGetWorkloadDetail(workspaceId, workloadId, {
    query: {
      enabled: Boolean(workspaceId && workloadId),
    },
  });

  const isUser = isUserMode(pathname);

  const handleClickChangeResource = () => {
    publish(WORKLOAD_EVENTS.openChangeResourceModal, { ...data, workspaceId });
  };

  const handleClickCloneWorkload = () => {
    publish(WORKLOAD_EVENTS.sendCreateWorkload, data);
  };

  if (isLoading) {
    return <MySpinner />;
  }

  return (
    <>
      {/* 상세 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>워크로드 상세정보</DetailContentTitle>
        <DetailContentTitleTool>
          <Button
            variant="outlined"
            width={120}
            height={30}
            icon="Resource"
            iconSize={20}
            onClick={handleClickChangeResource}
            iconColor="#000"
          >
            리소스 변경
          </Button>
          {isUser && (
            <Button
              variant="outlined"
              width={120}
              height={30}
              icon="Copy"
              onClick={handleClickCloneWorkload}
              iconColor="#000"
              data-testid={WORKLOAD_SELECTOR.DETAIL_CLONE_BUTTON}
            >
              워크로드 복제
            </Button>
          )}
        </DetailContentTitleTool>
      </DetailContentHeader>
      {/* 워크로드 상세 페이지 기본 정보 아티클 */}
      <WorkloadPrimaryArticle data={data} />
      {/* 워크로드 상세 페이지 추가 정보 아티클 */}
      <WorkloadSecondaryArticle data={data} workspaceId={workspaceId} />
      {/* Direct Snapshot 이미지 생성 모달 */}
      <CreateDirectSnapshotImageModal />
      {/* 워크로드 복제 모달 */}
      <CreateWorkloadDrawer />
      {/* 워크로드 리소스 프리셋 변경 모달 */}
      <UpdateWorkloadPresetModal />
    </>
  );
}
