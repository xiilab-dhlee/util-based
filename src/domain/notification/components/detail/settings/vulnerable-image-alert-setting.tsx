"use client";

import { useState } from "react";

import { NotificationSettingRow } from "@/domain/notification/components/detail/notification-setting-row";
import { NOTIFICATION_TYPE_LABEL } from "@/domain/notification/constants/notification.constant";

/**
 * 취약점 이미지 사용 요청 알림 설정 컴포넌트
 * 자체적으로 상태 관리를 담당
 */
export function VulnerableImageAlertSetting() {
  const [state, setState] = useState({
    systemChecked: true,
    emailChecked: false,
  });

  return (
    <NotificationSettingRow
      label={NOTIFICATION_TYPE_LABEL.VULNERABLE_IMAGE}
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
