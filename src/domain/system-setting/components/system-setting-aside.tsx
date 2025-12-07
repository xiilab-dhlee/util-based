"use client";

import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { TooltipHighlightText } from "@/styles/mixins/text";

/**
 * 시스템 설정 페이지 사이드바
 * AsideFillCard를 사용한 워크스페이스 생성 및 기본 리소스 설정 영역
 */
export function SystemSettingAside() {
  return (
    <AsideFillCard
      title="워크스페이스 생성 및 기본 리소스 설정"
      titleExtra={
        <GuideTooltip
          placement="left"
          maxWidth="500px"
          title={
            <>
              워크스페이스 생성 개수 설정은 사용자가 생성할 수 있는
              <br />
              워크스페이스의{" "}
              <TooltipHighlightText>최대 개수를 지정</TooltipHighlightText>하고,
              기본 리소스 설정은
              <br />
              워크로드 실행을 위한{" "}
              <TooltipHighlightText>
                초기 GPU, CPU, Memory 할당
              </TooltipHighlightText>
              을 지정합니다.
            </>
          }
        />
      }
    >
      {/* TODO: 사이드바 콘텐츠 */}
    </AsideFillCard>
  );
}
