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
import { useUpdateUrgentStandbyOrderAction } from "@/domain/scheduling-queue/hooks/scheduling-queue-actions";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export function UrgentQueueList() {
  const {
    data: urgentData,
    isLoading,
    isError,
  } = useGetUrgentStandbyWorkloads();

  const { mutate: updateOrder } = useUpdateUrgentStandbyOrderAction();

  // 드래그 중 순서 변경 효과를 위한 로컬 상태
  const [localWorkloads, setLocalWorkloads] = useState<QueueWorkloadResponse[]>(
    [],
  );

  // 서버 데이터가 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalWorkloads(urgentData || []);
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

    // 로컬 상태 즉시 업데이트 (optimistic update)
    const reordered = arrayMove(localWorkloads, oldIndex, newIndex);
    setLocalWorkloads(reordered);

    // 서버에 순서 변경 요청
    updateOrder(
      {
        data: {
          queueOrderItem: reordered.map((w, idx) => ({
            rank: idx + 1,
            workspaceResourceName: w.workspaceResourceName,
            workloadResourceName: w.workloadResourceName,
          })),
        },
      },
      {
        onError: () => {
          // 실패 시 서버 상태로 롤백
          setLocalWorkloads(urgentData || []);
        },
      },
    );
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
        <ListSectionTitle>긴급 대기열 목록</ListSectionTitle>
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
