"use client";

import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function SourcecodeRow({ children, rowData, className, ...restProps }: any) {
  const router = useRouter();
  const { id } = useParams();

  const isActive = Number(id) === rowData?.id;
  /**
   * 행 확장/축소 토글 핸들러
   *
   * @param e - 클릭 이벤트
   */
  const handleClickRow = (e: MouseEvent) => {
    e.stopPropagation();

    if (rowData) {
      router.push(`/standard/sourcecode/${rowData.id}`);
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

