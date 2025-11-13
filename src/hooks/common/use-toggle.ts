"use client";

import { useCallback, useState } from "react";

/**
 * 토글 상태 관리를 위한 커스텀 훅
 *
 * boolean 상태와 이를 제어하는 함수들을 제공합니다.
 * 토글, 켜기, 끄기 등의 반복적인 상태 관리 로직을 추상화합니다.
 * useState처럼 배열로 반환하여 자유롭게 변수명을 지정할 수 있습니다.
 *
 * @param initialValue - 초기 토글 상태 (기본값: false)
 * @returns [상태, 토글함수, 제어함수들] 튜플
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const [isOpen, toggleOpen] = useToggle(false);
 *
 * // 여러 개 사용 가능
 * const [isVisible, toggleVisible, { setTrue: show, setFalse: hide }] = useToggle(true);
 * const [isEnabled, toggleEnabled] = useToggle(false);
 *
 * return (
 *   <div>
 *     <button onClick={toggleOpen}>토글</button>
 *     <button onClick={show}>보이기</button>
 *     <button onClick={hide}>숨기기</button>
 *     <div>{isOpen ? '열림' : '닫힘'}</div>
 *   </div>
 * );
 * ```
 */
export const useToggle = (initialValue: boolean = false) => {
  // 토글 상태 관리
  const [value, setValue] = useState<boolean>(initialValue);

  /**
   * 상태를 토글하는 함수
   * 현재 상태의 반대값으로 설정합니다.
   */
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle] as const;
};

