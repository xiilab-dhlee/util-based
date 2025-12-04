"use client";

import { useState } from "react";

import { NotificationSettingCard } from "@/domain/notification/components/detail/notification-setting-card";

/**
 * 워크스페이스 리소스 요청 알림 설정 컴포넌트
 * 자체적으로 상태 관리를 담당
 */
export function WorkspaceResourceRequestAlertSetting() {
  const [state, setState] = useState({
    systemChecked: true,
    emailChecked: false,
  });

  return (
    <NotificationSettingCard
      label="워크스페이스 리소스 요청 알림"
      systemChecked={state.systemChecked}
      emailChecked={state.emailChecked}
      onSystemChange={(checked) =>
        setState((prev) => ({ ...prev, systemChecked: checked }))
      }
      onEmailChange={(checked) =>
        setState((prev) => ({ ...prev, emailChecked: checked }))
      }
    />
  );
}
