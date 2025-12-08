"use client";

import { Button } from "xiilab-ui";

import { SettingBox } from "@/domain/system-setting/components/setting-box";

/**
 * HPE One View 연동 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function HpeOneviewSetting() {
  const handleEdit = () => {
    // TODO: 수정 모달 열기 또는 수정 로직
    console.log("HPE One View 연동 수정");
  };

  return (
    <SettingBox
      title="HPE One View 연동"
      height={160}
      extra={
        <Button variant="outlined" size="small" onClick={handleEdit}>
          수정
        </Button>
      }
    >
      {/* TODO: HPE One View 연동 콘텐츠 */}
    </SettingBox>
  );
}
