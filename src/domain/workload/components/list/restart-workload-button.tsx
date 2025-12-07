"use client";

import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface RestartWorkloadButtonProps {
  workloadId: string;
  disabled?: boolean;
}

export function RestartWorkloadButton({
  workloadId,
  disabled,
}: RestartWorkloadButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKLOAD_EVENTS.sendRestartWorkload, workloadId);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClick} disabled={disabled}>
        <RefreshIcon width={20} height={20} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
