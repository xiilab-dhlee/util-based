"use client";

import { Typography } from "xiilab-ui";

export function MultiNodeTooltipTitle() {
  return (
    <Typography.Text variant="body-2-4">
      프로젝트가&nbsp;
      <Typography.Text variant="body-2-2" as="span" color="#2862FF">
        다중 노드
      </Typography.Text>
      에서 실행.
      <br />
      Horovod를 이용한 분산학습 시 선택.
    </Typography.Text>
  );
}
