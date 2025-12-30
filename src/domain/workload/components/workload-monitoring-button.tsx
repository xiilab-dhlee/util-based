"use client";

import { Button } from "xiilab-ui";

import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function WorkloadMonitoringButton() {
  const { onToggle } = useGlobalModal(openViewWorkloadMonitoringDrawerAtom);

  return (
    <Button
      type="button"
      size="small"
      variant="outlined"
      width={90}
      height={30}
      onClick={onToggle}
      icon="Monitoring02"
      iconColor="var(--icon-fill)"
      data-testid={WORKLOAD_SELECTOR.DETAIL_MONITORING_BUTTON}
    >
      모니터링
    </Button>
  );
}
