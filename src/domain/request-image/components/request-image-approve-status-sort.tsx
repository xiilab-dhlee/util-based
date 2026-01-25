"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { GetUsageRequestListApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REQUEST_IMAGE_STATUS_OPTIONS } from "@/domain/request-image/constants/request-image.constant";
import {
  requestImagePageAtom,
  requestImageStatusAtom,
} from "@/domain/request-image/state/request-image.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

interface RequestImageApproveStatusSortProps {
  disabled?: boolean;
}

/**
 * 이미지 요청 승인 상태별 필터 컴포넌트
 *
 * 이미지 요청 목록에서 상태(APPROVAL_WAITING, APPROVED, REJECTED)를 선택하여
 * 해당 상태의 이미지 요청만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 이미지 요청 승인 상태 선택 드롭다운 컴포넌트
 */
export function RequestImageApproveStatusSort({
  disabled = false,
}: RequestImageApproveStatusSortProps) {
  const [status, setStatus] = useAtom(requestImageStatusAtom);
  const resetPage = useResetAtom(requestImagePageAtom);

  const handleChange = (value: GetUsageRequestListApprovalStatus | null) => {
    resetPage();
    setStatus(value);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...REQUEST_IMAGE_STATUS_OPTIONS]}
      placeholder="승인 상태"
      onChange={handleChange}
      value={status}
      width={100}
      height={30}
      disabled={disabled}
    />
  );
}
