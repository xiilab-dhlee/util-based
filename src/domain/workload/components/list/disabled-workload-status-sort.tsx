"use client";

import { useAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { WORKLOAD_STATUS_OPTIONS } from "@/domain/workload/constants/workload.constant";
import { disabledWorkloadStatusAtom } from "@/domain/workload/state/workload.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

interface DisabledWorkloadStatusSortProps {
  disabled?: boolean;
}

/**
 * 비활성화 워크로드 상태별 정렬 컴포넌트
 *
 * 해당 상태의 비활성화 워크로드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 비활성화 워크로드 상태 선택 드롭다운 컴포넌트
 */
export function DisabledWorkloadStatusSort({
  disabled,
}: DisabledWorkloadStatusSortProps) {
  const [status, setStatus] = useAtom(disabledWorkloadStatusAtom);

  return (
    <div data-testid={WORKLOAD_SELECTOR.FILTER_STATUS}>
      <Dropdown
        options={[ALL_OPTION, ...WORKLOAD_STATUS_OPTIONS]}
        value={status}
        onChange={setStatus}
        placeholder="상태"
        width={100}
        height={30}
        disabled={disabled}
      />
    </div>
  );
}
