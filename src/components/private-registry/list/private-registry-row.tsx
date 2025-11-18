import classNames from "classnames";
import { useAtom } from "jotai";
import type { HTMLAttributes, MouseEvent } from "react";

import { privateRegistrySelectedItemAtom } from "@/atoms/private-registry.atom";
import type { PrivateRegistryListType } from "@/schemas/private-registry.schema";

interface PrivateRegistryRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: PrivateRegistryListType;
}

/**
 * PrivateRegistryRow 컴포넌트
 *
 * 프라이빗 레지스트리 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 레지스트리를 선택 상태로 변경하고 상세 정보를 표시합니다.
 * 현재 선택된 레지스트리와 일치하는 행은 활성 상태로 표시됩니다.
 *
 * @param rowData - 프라이빗 레지스트리 데이터
 * @returns 프라이빗 레지스트리 테이블 행 컴포넌트
 */
export function PrivateRegistryRow({
  children,
  rowData,
  className,
  ...restProps
}: PrivateRegistryRowProps) {
  // 토글 상태 관리
  const [selectedItem, setSelectedItem] = useAtom(
    privateRegistrySelectedItemAtom,
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
