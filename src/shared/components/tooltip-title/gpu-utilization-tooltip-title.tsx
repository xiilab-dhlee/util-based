"use client";

import { Typography } from "xiilab-ui";

export function GpuUtilizationTooltipTitle() {
  return (
    <Typography.Text variant="body-4-2">
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        MIG
      </Typography.Text>
      와&nbsp;
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        MPS
      </Typography.Text>
      &nbsp;적용시 집계에 반영되지 않습니다.
    </Typography.Text>
  );
}
