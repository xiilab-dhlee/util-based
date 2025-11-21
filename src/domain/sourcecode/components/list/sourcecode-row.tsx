"use client";

import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import type { HTMLAttributes, MouseEvent } from "react";

import type { SourcecodeListType } from "@/domain/sourcecode/schemas/sourcecode.schema";

interface SourcecodeRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: SourcecodeListType;
}

/**
 * SourcecodeRow 컴포넌트
 *
 * 소스코드 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 소스코드의 상세 페이지로 이동합니다.
 * 현재 선택된 소스코드와 일치하는 행은 활성 상태로 표시됩니다.
 *
 * @param rowData - 소스코드 목록 데이터
 * @returns 소스코드 테이블 행 컴포넌트
 */
export function SourcecodeRow({
  children,
  rowData,
  className,
  ...restProps
}: SourcecodeRowProps) {
  const router = useRouter();
  const { id } = useParams();

  const isActive = Number(id) === rowData?.id;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData) {
      router.push(`/user/sourcecode/${rowData.id}`);
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames("pointer", { active: isActive }, className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}
