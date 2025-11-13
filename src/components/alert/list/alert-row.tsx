"use client";

import classNames from "classnames";
import { useAtom } from "jotai";
import type { MouseEvent } from "react";

import { alertSelectedAtom } from "@/atoms/alert/alert-list.atom";

/**
 * 알림 테이블 행 컴포넌트
 *
 * 알림을 클릭하면 선택 상태로 변경하고 상세 정보를 표시합니다.
 */
export function AlertRow({ children, rowData, className, ...restProps }: any) {
  const [selectedAlert, setSelectedAlert] = useAtom(alertSelectedAtom);

  const isActive = selectedAlert === rowData?.id;

  /**
   * 행 클릭 핸들러
   *
   * @param e - 클릭 이벤트
   */
  const handleClickRow = (e: MouseEvent) => {
    e.stopPropagation();

    if (rowData) {
      setSelectedAlert(rowData.id);
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames({ active: isActive }, className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}

