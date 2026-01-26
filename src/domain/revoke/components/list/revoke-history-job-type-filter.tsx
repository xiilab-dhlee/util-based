"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { GetScanHistoryListWorkloadJobType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REVOKE_JOB_TYPE_OPTIONS } from "@/domain/revoke/constants/revoke-history.constant";
import {
  revokeHistoryJobTypeAtom,
  revokeHistoryPageAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

interface RevokeHistoryJobTypeFilterProps {
  disabled?: boolean;
}

/**
 * 리소스 회수 이력 목록 Job Type 필터 컴포넌트
 *
 * Job Type(INTERACTIVE, BATCH, DISTRIBUTED)을 선택하여
 * 해당 타입의 회수 이력만 필터링할 수 있는 드롭다운을 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 리소스 회수 이력 목록 Job Type 필터 컴포넌트
 */
export function RevokeHistoryJobTypeFilter({
  disabled,
}: RevokeHistoryJobTypeFilterProps) {
  const [jobType, setJobType] = useAtom(revokeHistoryJobTypeAtom);
  const resetPage = useResetAtom(revokeHistoryPageAtom);

  /**
   * Job Type 변경 핸들러
   * Job Type 변경 시 페이지를 초기화
   */
  const handleChange = (
    value: GetScanHistoryListWorkloadJobType | undefined,
  ) => {
    resetPage();
    setJobType(value || undefined);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...REVOKE_JOB_TYPE_OPTIONS]}
      placeholder="Job Type"
      onChange={handleChange}
      value={jobType ?? ""}
      width={150}
      height={30}
      disabled={disabled}
    />
  );
}
