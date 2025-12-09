"use client";

import classNames from "classnames";
import { useAtom } from "jotai";
import type { HTMLAttributes, MouseEvent } from "react";

import type { SourcecodeListType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { sourcecodeSelectedAtom } from "@/domain/sourcecode/state/sourcecode.atom";

interface SourcecodeRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: SourcecodeListType;
}

/**
 * SourcecodeRow 컴포넌트
 *
 * 소스코드 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 소스코드가 선택되어 Aside에 상세 정보가 표시됩니다.
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
  const [selectedId, setSelectedId] = useAtom(sourcecodeSelectedAtom);

  const isActive = selectedId === rowData?.id;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData) {
      setSelectedId(rowData.id);
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
