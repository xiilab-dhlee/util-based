"use client";

import type { WritableAtom } from "jotai";
import { useAtom } from "jotai";
import { useCallback } from "react";

/**
 * 전역 모달 상태 관리를 위한 커스텀 훅
 *
 * Jotai atom을 받아서 모달의 열림/닫힘 상태와 핸들러를 제공합니다.
 * 반복되는 모달 상태 관리 로직을 추상화하여 재사용성을 높입니다.
 *
 * @param modalAtom - 모달 열림/닫힘 상태를 관리하는 Jotai atom
 * @returns 모달 상태와 핸들러를 포함한 객체
 */
export const useGlobalModal = <T extends boolean = boolean>(
  modalAtom: WritableAtom<T, [T | ((prev: T) => T)], void>,
) => {
  // 모달 열림/닫힘 상태 관리
  const [open, setOpen] = useAtom(modalAtom);

  /**
   * 모달을 닫는 핸들러
   * 모달을 false 상태로 설정합니다.
   */
  const onClose = useCallback(() => {
    setOpen(false as T);
  }, [setOpen]);

  /**
   * 모달을 여는 핸들러
   * 모달을 true 상태로 설정합니다.
   */
  const onOpen = useCallback(() => {
    setOpen(true as T);
  }, [setOpen]);

  /**
   * 모달 상태를 토글하는 핸들러
   * 현재 상태의 반대값으로 설정합니다.
   */
  const onToggle = useCallback(() => {
    setOpen((prev: T) => !prev as T);
  }, [setOpen]);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
  };
};
