"use client";

import { useState } from "react";

/**
 * 로컬 상태 기반 모달 관리 훅
 *
 * 페이지 내에서만 사용되는 모달에 적합합니다.
 */
export function useStateModal(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen((prev) => !prev);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
  };
}
