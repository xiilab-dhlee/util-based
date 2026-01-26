"use client";

import { AddToUrgentQueueConfirmModal } from "@/domain/scheduling-queue/components/add-to-urgent-queue-confirm-modal";
import { DeleteUrgentQueueModal } from "@/domain/scheduling-queue/components/delete-urgent-queue-modal";
import { PendingWorkloadMain } from "@/domain/scheduling-queue/components/list/pending-workload-main";
import { ReorderUrgentQueueConfirmModal } from "@/domain/scheduling-queue/components/reorder-urgent-queue-confirm-modal";
import { UrgentQueueList } from "@/domain/scheduling-queue/components/urgent-queue-list";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export function SchedulingQueueMain() {
  return (
    <>
      <PageHeader
        pageKey="admin.scheduling-queue"
        description="Scheduling Queue Management"
      />
      <ListPageMain>
        {/* 왼쪽: 대기중인 워크로드 목록 */}
        <ListPageBody>
          <PendingWorkloadMain />
        </ListPageBody>

        {/* 오른쪽: 긴급 대기열 목록 */}
        <ListPageAside $width={ASIDE_WIDTH}>
          <AsideDetailContainer>
            <UrgentQueueList />
          </AsideDetailContainer>
        </ListPageAside>
      </ListPageMain>

      {/* 모달 */}
      <DeleteUrgentQueueModal />
      <ReorderUrgentQueueConfirmModal />
      <AddToUrgentQueueConfirmModal />
    </>
  );
}
