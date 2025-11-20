"use client";

import { useAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { WORKLOAD_STATUS_OPTIONS } from "@/domain/workload/constants/workload.constant";
import { workloadStatusAtom } from "@/domain/workload/state/workload.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

/**
 * 워크로드 상태별 정렬 컴포넌트
 *
 * 해당 상태의 워크로드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @returns 워크로드 상태 선택 드롭다운 컴포넌트
 */
export function WorkloadStatusSort() {
  const [status, setStatus] = useAtom(workloadStatusAtom);

  const handleChange = (value: string | null) => {
    setStatus(value);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...WORKLOAD_STATUS_OPTIONS]}
      value={status}
      onChange={handleChange}
      placeholder="상태"
      width={100}
      height={30}
    />
  );
}
