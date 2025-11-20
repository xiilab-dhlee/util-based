"use client";

import { Typography } from "xiilab-ui";

export function UpdateMigTooltipTitle() {
  return (
    <Typography.Text variant="body-4-2">
      <Typography.Text variant="body-3-1" as="span" color="#FF3737">
        MIG 비활성화시&nbsp;
      </Typography.Text>
      더 이상 MIG 기능을 사용할 수 없습니다. <br />
      기능 설정 시&nbsp;
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        MIG개수
      </Typography.Text>
      를{" "}
      <Typography.Text variant="body-3-1" as="span" color="#2862FF">
        선택
      </Typography.Text>
      해 주세요.
    </Typography.Text>
  );
}
