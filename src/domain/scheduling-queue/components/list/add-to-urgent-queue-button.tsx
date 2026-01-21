import { Button } from "xiilab-ui";

import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

interface AddToUrgentQueueButtonProps {
  workload: AdminWorkloadResponse;
  onAddToUrgentQueue: (workload: AdminWorkloadResponse) => void;
  isAddingToQueue?: boolean;
  /** 긴급 대기열이 가득 찼는지 여부 (최대 5개) */
  isQueueFull?: boolean;
}

export function AddToUrgentQueueButton({
  workload,
  onAddToUrgentQueue,
  isAddingToQueue,
  isQueueFull,
}: AddToUrgentQueueButtonProps) {
  const handleClick = () => {
    onAddToUrgentQueue(workload);
  };

  return (
    <Button
      icon="Plus"
      onClick={handleClick}
      disabled={isAddingToQueue || isQueueFull}
      aria-label="긴급 대기열 추가"
    />
  );
}
