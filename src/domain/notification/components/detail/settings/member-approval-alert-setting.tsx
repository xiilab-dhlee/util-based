"use client";

import { useState } from "react";

import { NotificationSettingRow } from "@/domain/notification/components/detail/notification-setting-row";
import { NOTIFICATION_TYPE_LABEL } from "@/domain/notification/constants/notification.constant";

/**
 * 회원 승인 요청 알림 설정 컴포넌트
 * 자체적으로 상태 관리를 담당
 */
export function MemberApprovalAlertSetting() {
  const [state, setState] = useState({
    systemChecked: false,
    emailChecked: false,
  });

  return (
    <NotificationSettingRow
      label={NOTIFICATION_TYPE_LABEL.MEMBER_APPROVAL}
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
