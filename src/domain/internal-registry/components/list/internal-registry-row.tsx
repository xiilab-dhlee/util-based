import classNames from "classnames";
import { useAtom } from "jotai";
import type { HTMLAttributes, MouseEvent } from "react";

import type { InternalRegistryListType } from "@/domain/internal-registry/schemas/internal-registry.schema";
import { internalregistrySelectedItemAtom } from "@/domain/internal-registry/state/internal-registry.atom";

interface InternalRegistryRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: InternalRegistryListType;
}

/**
 * InternalRegistryRow 컴포넌트
 *
 * 프라이빗 레지스트리 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 레지스트리를 선택 상태로 변경하고 상세 정보를 표시합니다.
 * 현재 선택된 레지스트리와 일치하는 행은 활성 상태로 표시됩니다.
 *
 * @param rowData - 프라이빗 레지스트리 데이터
 * @returns 프라이빗 레지스트리 테이블 행 컴포넌트
 */
export function InternalRegistryRow({
  children,
  rowData,
  className,
  ...restProps
}: InternalRegistryRowProps) {
  // 토글 상태 관리
  const [selectedItem, setSelectedItem] = useAtom(
    internalregistrySelectedItemAtom,
  );
  const isActive = selectedItem === rowData?.name;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData) {
      setSelectedItem(rowData.name);
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
