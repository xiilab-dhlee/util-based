"use client";

import { useAtom } from "jotai";

import { requestImageStatusAtom } from "@/atoms/request-image.atom";
import { MySelect } from "@/components/common/select";
import { REQUEST_IMAGE_STATUS_OPTIONS } from "@/constants/request-image/request-image.constant";

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
    if (value) {
      setStatus(value);
    }
  };

  return (
    <MySelect
      options={REQUEST_IMAGE_STATUS_OPTIONS} // 이미지 요청 상태 옵션들
      placeholder="상태" // 플레이스홀더 텍스트
      setValue={handleChange} // 값 변경 핸들러
      value={status} // 현재 선택된 상태 값
      width={100} // 선택기 너비
      height={30} // 선택기 높이
    />
  );
}
