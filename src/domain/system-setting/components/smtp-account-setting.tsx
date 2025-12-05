"use client";

import { Button } from "xiilab-ui";

import { SettingBox } from "./setting-box";

/**
 * SMTP 계정 정보 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function SmtpAccountSetting() {
  const handleEdit = () => {
    // TODO: 수정 모달 열기 또는 수정 로직
    console.log("SMTP 계정 정보 수정");
  };

  return (
    <SettingBox
      title="SMTP 계정 정보"
      extra={
        <Button variant="outlined" size="small" onClick={handleEdit}>
          수정
        </Button>
      }
      height={138}
    >
      {/* TODO: SMTP 계정 정보 콘텐츠 */}
    </SettingBox>
  );
}
