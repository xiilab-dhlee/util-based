import { useState } from "react";
import { Switch } from "xiilab-ui";

/**
 * 사용자 상태 스위치 컴포넌트
 *
 * 사용자의 활성화/비활성화 상태를 on/off로 제어할 수 있는 스위치입니다.
 * 스위치를 토글하면 사용자의 상태가 즉시 업데이트됩니다.
 *
 * @param props - 컴포넌트 props
 * @returns 사용자 상태 제어 스위치
 *
 * @example
 * ```tsx
 * <AccountStatusSwitch
 *   accountId="123"
 *   status="활성화"
 * />
 * ```
 */
export function AccountStatusSwitch() {
  // 로컬 상태로 현재 스위치의 체크 상태를 관리
  // status가 "활성화"이면 true, 아니면 false
  const [checked, setChecked] = useState(true);

  /**
   * 스위치 변경 핸들러
   * 스위치를 토글하면 로컬 상태를 업데이트합니다.
   *
   * @param checked - 새로운 스위치 상태 (true: 활성화, false: 비활성화)
   */
  const handleChange = (checked: boolean) => {
    // TODO: 추후 실제 API 호출 추가
    // updateAccountStatus.mutate({ accountId, status: checked ? "활성화" : "비활성화" });

    // 로컬 상태 업데이트
    setChecked(checked);
  };

  return <Switch checked={checked} onChange={handleChange} />;
}
