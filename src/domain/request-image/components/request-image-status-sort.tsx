"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import { REQUEST_IMAGE_STATUS_OPTIONS } from "@/domain/request-image/constants/request-image.constant";
import {
  requestImagePageAtom,
  requestImageStatusAtom,
} from "@/domain/request-image/state/request-image.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

/**
 * 이미지 요청 상태별 정렬 컴포넌트
 *
 * 이미지 요청 목록에서 상태(PENDING, APPROVED, REJECTED, COMPLETED)를 선택하여
 * 해당 상태의 이미지 요청만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @returns 이미지 요청 상태 선택 드롭다운 컴포넌트
 */
export function RequestImageStatusSort() {
  // Jotai atom을 사용하여 이미지 요청 상태 관리
  const [status, setStatus] = useAtom(requestImageStatusAtom);
  const resetPage = useResetAtom(requestImagePageAtom);

  /**
   * 상태 선택 변경 핸들러
   * 상태 변경 시 페이지를 초기화
   *
   * @param value - 선택된 상태 값 (string | null)
   */
  const handleChange = (value: string | null) => {
    resetPage();
    setStatus(value);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...REQUEST_IMAGE_STATUS_OPTIONS]}
      placeholder="상태"
      onChange={handleChange}
      value={status}
      width={100}
      height={30}
    />
  );
}
