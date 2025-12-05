"use client";

import { useState } from "react";

import { NotificationSettingCard } from "@/domain/notification/components/detail/notification-setting-card";
import { NOTIFICATION_TYPE_LABEL } from "@/domain/notification/constants/notification.constant";

/**
 * 워크스페이스 생성 알림 설정 컴포넌트
 * 자체적으로 상태 관리를 담당
 */
export function WorkspaceCreateAlertSetting() {
  const [state, setState] = useState({
    systemChecked: false,
    emailChecked: false,
  });

  return (
    <NotificationSettingCard
      label={NOTIFICATION_TYPE_LABEL.WORKSPACE_CREATE}
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
