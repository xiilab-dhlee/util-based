"use client";

import { Button } from "xiilab-ui";

import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { TooltipHighlightText } from "@/styles/mixins/text";
import { SettingBox } from "./setting-box";

/**
 * 리소스 회수 기준 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function ResourceRevokeSetting() {
  const handleEdit = () => {
    // TODO: 수정 모달 열기 또는 수정 로직
    console.log("리소스 회수 기준 수정");
  };

  return (
    <SettingBox
      title="리소스 회수 기준"
      titleExtra={
        <GuideTooltip
          placement="right"
          maxWidth="600px"
          title={
            <>
              리소스 사용률이 일정 시간 동안 설정 기준값을 넘지 못할 경우
              <br />
              <TooltipHighlightText>리소스가 회수</TooltipHighlightText>
              됩니다. MIG, MPS는 리소스 회수 대상이 아닙니다.
            </>
          }
        />
      }
      extra={
        <Button variant="outlined" size="small" onClick={handleEdit}>
          수정
        </Button>
      }
      height={330}
    >
      {/* TODO: 리소스 회수 기준 콘텐츠 */}
    </SettingBox>
  );
}
