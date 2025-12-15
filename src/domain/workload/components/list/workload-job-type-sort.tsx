"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import { WORKLOAD_JOB_OPTIONS } from "@/domain/workload/constants/workload.constant";
import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import {
  workloadJobTypeAtom,
  workloadPageAtom,
} from "@/domain/workload/state/workload.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

interface WorkloadJobTypeSortProps {
  disabled?: boolean;
}

/**
 * 워크로드 목록 페이지 작업 유형 정렬 컴포넌트
 *
 * 워크로드 목록 페이지에서 작업 유형(INTERACTIVE, BATCH)을 선택하여
 * 해당 유형의 워크로드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 워크로드 목록 페이지 작업 유형 정렬 컴포넌트
 */
export function WorkloadJobTypeSort({ disabled }: WorkloadJobTypeSortProps) {
  const [jobType, setJobType] = useAtom(workloadJobTypeAtom);
  const resetPage = useResetAtom(workloadPageAtom);

  /**
   * 작업 유형 변경 핸들러
   * 작업 유형 변경 시 페이지를 초기화
   */
  const handleChange = (value: WorkloadJobType | null) => {
    resetPage();
    setJobType(value);
  };

  return (
    <div data-testid={WORKLOAD_SELECTOR.FILTER_JOB_TYPE}>
      <Dropdown
        options={[ALL_OPTION, ...WORKLOAD_JOB_OPTIONS]}
        placeholder="워크로드 잡 타입"
        onChange={handleChange}
        value={jobType}
        width={150}
        height={30}
        disabled={disabled}
      />
    </div>
  );
}
