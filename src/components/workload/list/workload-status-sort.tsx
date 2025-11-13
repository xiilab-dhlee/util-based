"use client";

import { useAtom } from "jotai";

import { workloadStatusAtom } from "@/atoms/workload/workload-list.atom";
import { MySelect } from "@/components/common/select";
import { Workload } from "@/models/workload.model";

/**
 * 워크로드 상태별 정렬 컴포넌트
 *
 * 워크로드 목록에서 상태(running, pending, failed, completed)를 선택하여
 * 해당 상태의 워크로드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @returns 워크로드 상태 선택 드롭다운 컴포넌트
 */
export function WorkloadStatusSort() {
  // Jotai atom을 사용하여 워크로드 상태 관리
  const [status, setStatus] = useAtom(workloadStatusAtom);

  /**
   * 상태 선택 변경 핸들러
   *
   * @param value - 선택된 상태 값 (string | null)
   */
  const handleChange = (value: string | null) => {
    if (value) {
      setStatus(value);
    }
  };

  return (
    <MySelect
      options={Workload.STATUS_OPTIONS} // 워크로드 상태 옵션들
      placeholder="상태" // 플레이스홀더 텍스트
      setValue={handleChange} // 값 변경 핸들러
      value={status} // 현재 선택된 상태 값
      width={100} // 선택기 너비
      height={30} // 선택기 높이
    />
  );
}
