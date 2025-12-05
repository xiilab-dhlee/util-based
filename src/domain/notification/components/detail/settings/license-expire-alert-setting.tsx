"use client";

import { useState } from "react";

import { NotificationSettingRow } from "@/domain/notification/components/detail/notification-setting-row";
import { NOTIFICATION_TYPE_LABEL } from "@/domain/notification/constants/notification.constant";
import type { NotificationChannelState } from "@/domain/notification/type/notification-setting.type";

/**
 * 라이선스 만료 경고 알림 설정 컴포넌트
 * 자체적으로 상태 관리를 담당
 */
export function LicenseExpireAlertSetting() {
  const [state, setState] = useState<NotificationChannelState>({
    systemChecked: true,
    emailChecked: true,
  });

  return (
    <NotificationSettingRow
      label={NOTIFICATION_TYPE_LABEL.LICENSE_EXPIRE}
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
