"use client";

import { Typography } from "xiilab-ui";

export function WorkloadImageTooltipTitle() {
  return (
    <Typography.Text variant="body-3-3">
      <Typography.Text variant="body-3-1" as="span" color="#0022e0">
        허브:&nbsp;
      </Typography.Text>
      이미지나 애플리케이션의 중앙 저장소로, 사용자가 공유하거나 검색할 수 있는
      공개 라이브러리 이미지 입니다.
      <br />
      <Typography.Text variant="body-3-1" as="span" color="#0022e0">
        빌트인 이미지:&nbsp;
      </Typography.Text>
      AstraGo에 기본적으로 포함된 이미지로, 사용자의 별도 설치 없이 바로 사용
      가능한 기본 이미지입니다.
      <br />
      <Typography.Text variant="body-3-1" as="span" color="#0022e0">
        내부 레지스트리:&nbsp;
      </Typography.Text>
      하버는 기업 내부에서 업로드된 이미지입니다.
      <br />
      <Typography.Text variant="body-3-1" as="span" color="#0022e0">
        외부 레지스트리:&nbsp;
      </Typography.Text>
      도커 허브(Docker Hub)와 같은 공개된 외부 레지스트리에서 제공되는
      이미지입니다.
    </Typography.Text>
  );
}
