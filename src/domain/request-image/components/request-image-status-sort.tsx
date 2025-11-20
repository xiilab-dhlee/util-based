"use client";

import { useAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { REQUEST_IMAGE_STATUS_OPTIONS } from "@/domain/request-image/constants/request-image.constant";
import { requestImageStatusAtom } from "@/domain/request-image/state/request-image.atom";
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

  /**
   * 상태 선택 변경 핸들러
   *
   * @param value - 선택된 상태 값 (string | null)
   */
  const handleChange = (value: string | null) => {
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
