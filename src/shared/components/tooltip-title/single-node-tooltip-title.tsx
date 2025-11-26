"use client";

import { Typography } from "xiilab-ui";

export function SingleNodeTooltipTitle() {
  return (
    <Typography.Text variant="body-2-4">
      프로젝트가&nbsp;
      <Typography.Text variant="body-2-2" as="span" color="#2862FF">
        단일 노드
      </Typography.Text>
      에서 실행.
    </Typography.Text>
  );
}
