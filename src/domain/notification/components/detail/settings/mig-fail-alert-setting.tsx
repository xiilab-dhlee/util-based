"use client";

import { useState } from "react";

import { NotificationSettingCard } from "@/domain/notification/components/detail/notification-setting-card";

/**
 * MIG 장애 알림 설정 컴포넌트
 * 자체적으로 상태 관리를 담당
 */
export function MigFailAlertSetting() {
  const [state, setState] = useState({
    systemChecked: true,
    emailChecked: false,
  });

  return (
    <NotificationSettingCard
      label="MIG 장애 알림"
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
