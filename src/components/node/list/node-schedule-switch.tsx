import { useState } from "react";
import { Switch } from "xiilab-ui";

import { useUpdateNodeSchedule } from "@/hooks/node/use-update-node-schedule";

/**
 * 노드 스케줄링 상태를 제어하는 스위치 컴포넌트의 props 인터페이스
 */
interface NodeScheduleSwitchProps {
  /** 노드 이름 */
  nodeName: string;
  /** 스케줄링 가능 여부 */
  schedulable: boolean;
}

/**
 * 노드 스케줄링 스위치 컴포넌트
 *
 * 쿠버네티스 노드의 스케줄링 상태를 on/off로 제어할 수 있는 스위치입니다.
 * 스위치를 토글하면 노드의 스케줄링 설정이 즉시 업데이트됩니다.
 *
 * @param props - 컴포넌트 props
 * @returns 노드 스케줄링 제어 스위치
 *
 * @example
 * ```tsx
 * <NodeScheduleSwitch
 *   nodeName="worker-1"
 *   schedulable={true}
 * />
 * ```
 */
export function NodeScheduleSwitch({
  nodeName,
  schedulable,
}: NodeScheduleSwitchProps) {
  // 로컬 상태로 현재 스위치의 체크 상태를 관리
  const [checked, setChecked] = useState(schedulable);

  // 노드 스케줄링 업데이트를 위한 mutation hook
  const updateNodeSchedule = useUpdateNodeSchedule();

  /**
   * 스위치 변경 핸들러
   * 스위치를 토글하면 서버에 스케줄링 설정 변경 요청을 전송합니다.
   *
   * @param checked - 새로운 스위치 상태 (true: 스케줄링 활성화, false: 비활성화)
   */
  const handleChange = (checked: boolean) => {
    updateNodeSchedule.mutate(
      {
        nodeName,
        type: checked ? "ON" : "OFF",
      },
      {
        onSuccess: () => {
          // 서버 요청 성공 시 로컬 상태도 업데이트
          setChecked(checked);
        },
      },
    );
  };

  return <Switch checked={checked} onChange={handleChange} />;
}
