import classNames from "classnames";
import { useAtom } from "jotai";

import { privateRegistrySelectedItemAtom } from "@/atoms/registry/private-registry-list.atom";

export function PrivateRegistryRow({
  children,
  rowData,
  className,
  ...restProps
}: any) {
  // 토글 상태 관리
  const [selectedItem, setSelectedItem] = useAtom(
    privateRegistrySelectedItemAtom,
  );
  const isActive = selectedItem === rowData?.name;
  /**
   * 행 확장/축소 토글 핸들러
   *
   * @param e - 클릭 이벤트
   */
  const handleClickRow = (e: React.MouseEvent) => {
    e.stopPropagation();

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

