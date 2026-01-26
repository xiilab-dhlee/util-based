"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useGetUrgentStandbyWorkloads } from "@/api/generated/admin-queue/admin-queue";
import type { QueueWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SortableUrgentQueueCard } from "@/domain/scheduling-queue/components/sortable-urgent-queue-card";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export function UrgentQueueList() {
  const {
    data: urgentData,
    isLoading,
    isError,
    refetch,
  } = useGetUrgentStandbyWorkloads({
    query: {
      refetchInterval: 30 * 1000,
    },
  });

  // 드래그 중 순서 변경 효과를 위한 로컬 상태
  const [localWorkloads, setLocalWorkloads] = useState<QueueWorkloadResponse[]>(
    [],
  );

  // 서버 데이터가 변경되면 로컬 상태 동기화 (rank로 정렬)
  useEffect(() => {
    const sorted = [...(urgentData || [])].sort(
      (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
    );
    setLocalWorkloads(sorted);
  }, [urgentData]);

  /**
   * 삭제 버튼 클릭 시 confirm 모달 열기
   */
  const handleDeleteClick = (workload: QueueWorkloadResponse) => {
    pubsubUtil.publish(
      SCHEDULING_QUEUE_EVENTS.openDeleteUrgentQueueModal,
      workload,
    );
  };

  /**
   * 드래그 앤 드롭 완료 핸들러
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localWorkloads.findIndex(
      (w) => w.workloadResourceName === active.id,
    );
    const newIndex = localWorkloads.findIndex(
      (w) => w.workloadResourceName === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(localWorkloads, oldIndex, newIndex);
    const movedWorkload = localWorkloads[oldIndex];
    const originalOrder = localWorkloads;

    // 1. UI 미리 업데이트 (optimistic update)
    setLocalWorkloads(reordered);

    // 2. 확인 모달 열기
    pubsubUtil.publish(SCHEDULING_QUEUE_EVENTS.openReorderConfirmModal, {
      workloadName: movedWorkload.workloadName,
      oldRank: oldIndex + 1,
      newRank: newIndex + 1,
      reorderedList: reordered,
      onCancel: () => {
        // 취소 시 원래 순서로 복구
        setLocalWorkloads(originalOrder);
        refetch();
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingWrapper>
          <Spin />
        </LoadingWrapper>
      );
    }

    if (isError) {
      return <DataErrorState />;
    }

    if (localWorkloads.length === 0) {
      return <EmptyState />;
    }

    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={localWorkloads.map((w) => w.workloadResourceName)}
          strategy={verticalListSortingStrategy}
        >
          {localWorkloads.map((workload) => (
            <SortableUrgentQueueCard
              key={workload.workloadResourceName}
              workload={workload}
              onDelete={handleDeleteClick}
            />
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <ListSectionTitle>긴급 대기열 목록</ListSectionTitle>
          <GuideTooltip
            iconSize={20}
            maxWidth="100%"
            title={
              <>
                드래그 앤 드롭으로 긴급 대기열 내에서 우선순위를 변경할 수
                있으며,
                <br />
                긴급 대기열의 워크로드가 모두 실행되면 대기중 상태인 워크로드가
                순차적으로 실행됩니다.
              </>
            }
          />
        </TitleWrapper>
      </Header>

      <CardList>{renderContent()}</CardList>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-x: hidden;
  overflow-y: auto;

  ${customScrollbar()}
`;

const LoadingWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
