"use client";

import { Typography } from "xiilab-ui";

export function RequestUseTooltipTitle() {
  return (
    <Typography.Text variant="body-3-3">
      요청사항은 관리자에게 전달됩니다.
      <br />
      관리자가 이미지를 승인한 후 해당 이미지를 사용하실 수 있습니다.
    </Typography.Text>
  );
}
