import { Switch } from "xiilab-ui";

import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface AccountStatusSwitchProps {
  account: AccountListType;
}

/**
 * 사용자 상태 스위치 컴포넌트
 *
 * 사용자의 활성화/비활성화 상태를 on/off로 제어할 수 있는 스위치입니다.
 * 스위치를 토글하면 확인 모달이 표시되고, 확인 시 상태가 업데이트됩니다.
 *
 * @param props - 컴포넌트 props
 * @param props.account - 사용자 정보
 * @returns 사용자 상태 제어 스위치
 *
 */
export function AccountStatusSwitch({ account }: AccountStatusSwitchProps) {
  const publish = usePublish();

  /**
   * 스위치 클릭 핸들러
   * 상태 변경 확인 모달을 열기 위한 이벤트를 발행합니다.
   */
  const handleChange = () => {
    publish(ACCOUNT_EVENTS.sendUpdateAccountStatus, {
      accountId: account.id,
      accountName: account.name,
      currentStatus: account.isEnabled,
      nextStatus: !account.isEnabled,
    });
  };

  return <Switch checked={account.isEnabled} onChange={handleChange} />;
}
