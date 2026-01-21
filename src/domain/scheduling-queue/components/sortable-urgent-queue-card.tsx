"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { QueueWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { UrgentQueueCard } from "@/domain/scheduling-queue/components/urgent-queue-card";

interface SortableUrgentQueueCardProps {
  workload: QueueWorkloadResponse;
  onDelete: (workload: QueueWorkloadResponse) => void;
}

/**
 * 드래그 가능한 긴급 대기열 카드 래퍼
 */
export function SortableUrgentQueueCard({
  workload,
  onDelete,
}: SortableUrgentQueueCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: workload.workloadResourceName });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <UrgentQueueCard workload={workload} onDelete={onDelete} />
    </div>
  );
}
