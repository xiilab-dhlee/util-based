"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function WorkloadImageTooltipTitle() {
  return (
    <>
      <TooltipHighlightText>허브:&nbsp;</TooltipHighlightText>
      이미지나 애플리케이션의 중앙 저장소로, 사용자가 공유하거나 검색할 수 있는
      공개 라이브러리 이미지 입니다.
      <br />
      <TooltipHighlightText>빌트인 이미지:&nbsp;</TooltipHighlightText>
      AstraGo에 기본적으로 포함된 이미지로, 사용자의 별도 설치 없이 바로 사용
      가능한 기본 이미지입니다.
      <br />
      <TooltipHighlightText>내부 레지스트리:&nbsp;</TooltipHighlightText>
      하버는 기업 내부에서 업로드된 이미지입니다.
      <br />
      <TooltipHighlightText>외부 레지스트리:&nbsp;</TooltipHighlightText>
      도커 허브(Docker Hub)와 같은 공개된 외부 레지스트리에서 제공되는
      이미지입니다.
    </>
  );
}
