"use client";

import { Typography } from "xiilab-ui";

export function GpuTooltipTitle() {
  return (
    <Typography.Text variant="body-4-2" color="#000">
      해당 타입의 GPU 리소스가 부족하여, <br />
      워크로드 실행 시 "
      <Typography.Text variant="body-4-2" as="span" color="#0022E0">
        대기
      </Typography.Text>
      " 상태로 전환됩니다.
    </Typography.Text>
  );
}
