"use client";

import { Button } from "xiilab-ui";

import { SettingBox } from "@/domain/system-setting/components/setting-box";

/**
 * 라이선스 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function LicenseSetting() {
  const handleRenew = () => {
    // TODO: 갱신 모달 열기 또는 갱신 로직
    console.log("라이선스 갱신");
  };

  return (
    <SettingBox
      title="라이선스"
      extra={
        <Button variant="outlined" size="small" onClick={handleRenew}>
          갱신하기
        </Button>
      }
      height={138}
    >
      {/* TODO: 라이선스 콘텐츠 */}
    </SettingBox>
  );
}
