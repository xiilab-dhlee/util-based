"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { ActiveWorkloadItemWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACTIVE_WORKLOAD_STATUS_OPTIONS } from "@/domain/workload/constants/workload.constant";
import {
  activeWorkloadPageAtom,
  activeWorkloadStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

interface ActiveWorkloadStatusSortProps {
  disabled?: boolean;
}

/**
 * 활성화 워크로드 상태별 정렬 컴포넌트
 *
 * 해당 상태의 활성화 워크로드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 활성화 워크로드 상태 선택 드롭다운 컴포넌트
 */
export function ActiveWorkloadStatusSort({
  disabled,
}: ActiveWorkloadStatusSortProps) {
  const [status, setStatus] = useAtom(activeWorkloadStatusAtom);
  const resetPage = useResetAtom(activeWorkloadPageAtom);

  /**
   * 상태 변경 핸들러
   * 상태 변경 시 페이지를 초기화
   */
  const handleChange = (value: ActiveWorkloadItemWorkloadStatus | null) => {
    resetPage();
    setStatus(value);
  };

  return (
    <div data-testid={WORKLOAD_SELECTOR.FILTER_STATUS}>
      <Dropdown
        options={[ALL_OPTION, ...ACTIVE_WORKLOAD_STATUS_OPTIONS]}
        value={status}
        onChange={handleChange}
        placeholder="상태"
        width={100}
        height={30}
        disabled={disabled}
      />
    </div>
  );
}
