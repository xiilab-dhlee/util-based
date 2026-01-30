"use client";

import { useAtomCallback } from "jotai/utils";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "xiilab-ui";

import {
  getWorkloadCloneData,
  useGetWorkloadDetail,
} from "@/api/generated/workload/workload";
import { CreateDirectSnapshotImageModal } from "@/domain/workload/components/create-direct-snapshot-image-modal";
import { WorkloadPrimaryArticle } from "@/domain/workload/components/detail/workload-primary-article";
import { WorkloadSecondaryArticle } from "@/domain/workload/components/detail/workload-secondary-article";
import { useWorkloadStatusPolling } from "@/domain/workload/hooks/use-workload-status-polling";
import { mapCloneDataToAtoms } from "@/domain/workload/utils/map-clone-data-to-atoms";
import { resetAllWorkloadAtoms } from "@/domain/workload/utils/reset-workload-atoms";
import {
  canDuplicateWorkload,
  getWorkloadActionStates,
} from "@/domain/workload/utils/workload.util";
import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { MySpinner } from "@/shared/components/spinner";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { openCreateWorkloadDrawerAtom } from "@/shared/state/modal.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";
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
  const { data: session } = useSession();

  const workspaceId = Number(searchParams?.get("workspaceId"));
  const workloadId = String(id);

  const { data, isLoading } = useGetWorkloadDetail(workspaceId, workloadId, {
    query: {
      enabled: Boolean(workspaceId && workloadId),
    },
  });

  const { status: polledStatus } = useWorkloadStatusPolling({
    workspaceId,
    workloadResourceName: workloadId,
    enabled: Boolean(workspaceId && workloadId),
  });

  const isUser = isUserMode(pathname);
  const actionStates = getWorkloadActionStates(polledStatus || "PENDING");

  // 복제 권한 확인: 생성자 본인만 복제 가능
  const currentUserId = getSessionAccountId(session);
  const canDuplicate =
    currentUserId && data?.creatorId
      ? canDuplicateWorkload(data.creatorId, currentUserId)
      : false;

  const handleClickChangeResource = () => {
    if (!data?.workloadResourceName) return;
    publish(WORKLOAD_EVENTS.openChangeResourceModal, {
      workloadResourceName: data.workloadResourceName,
      workspaceId,
    });
  };

  const handleClickCloneWorkload = useAtomCallback(
    useCallback(
      async (_get, set) => {
        if (!data?.workloadResourceName) return;

        try {
          const cloneData = await getWorkloadCloneData(
            workspaceId,
            data.workloadResourceName,
          );

          resetAllWorkloadAtoms(set);

          if (cloneData) {
            mapCloneDataToAtoms(cloneData, set);
          }

          set(openCreateWorkloadDrawerAtom, true);
        } catch (error) {
          console.error("❌ Failed to clone workload:", error);
          toast.error(`워크로드 복제 데이터를 가져오는데 실패했습니다.`);
        }
      },
      [data?.workloadResourceName, workspaceId],
    ),
  );

  if (isLoading) {
    return <MySpinner />;
  }

  return (
    <>
      <DetailContentHeader>
        <DetailContentTitle>워크로드 상세정보</DetailContentTitle>
        <DetailContentTitleTool>
          {actionStates?.canChangeResource && (
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
          )}
          {isUser && canDuplicate && (
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
      <WorkloadPrimaryArticle data={data} />
      <WorkloadSecondaryArticle data={data} workspaceId={workspaceId} />
      <CreateDirectSnapshotImageModal />
      <CreateWorkloadDrawer />
    </>
  );
}
