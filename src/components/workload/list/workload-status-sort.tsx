"use client";

import { useAtom } from "jotai";

import { workloadStatusAtom } from "@/atoms/workload.atom";
import { MySelect } from "@/components/common/select";
import { WORKLOAD_STATUS_OPTIONS } from "@/constants/workload/workload.constant";

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
    if (value) {
      setStatus(value);
    }
  };

  return (
    <MySelect
      options={WORKLOAD_STATUS_OPTIONS}
      placeholder="상태"
      setValue={handleChange}
      value={status}
      width={100}
      height={30}
    />
  );
}
