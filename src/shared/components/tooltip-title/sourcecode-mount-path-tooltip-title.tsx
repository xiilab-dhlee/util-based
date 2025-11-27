"use client";

import { Typography } from "xiilab-ui";

export function SourcecodeMountPathTooltipTitle() {
  return (
    <Typography.Text variant="body-4-2" color="#000">
      컨테이너 안에서 선택한&nbsp;
      <Typography.Text variant="body-4-2" as="span" color="#0022E0">
        소스코드의 디렉토리
      </Typography.Text>
      가 마운트되는 경로입니다.
    </Typography.Text>
  );
}
