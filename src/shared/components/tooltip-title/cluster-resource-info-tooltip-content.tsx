"use client";

import { Typography } from "xiilab-ui";

export function ClusterResourceInfoTooltipTitle() {
  return (
    <Typography.Text variant="body-3-1">
      GPU 정보는&nbsp;
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        MIG
      </Typography.Text>
      와&nbsp;
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        MPS
      </Typography.Text>
      를&nbsp;
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        제외한 값
      </Typography.Text>
      이 표시됩니다.
    </Typography.Text>
  );
}
