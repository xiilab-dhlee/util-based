import type { ComponentType, HTMLAttributes } from "react";

/**
 * 행 데이터를 전달하는 HOC
 * @param RowComponent 행 컴포넌트
 * @returns 행 컴포넌트
 */
export function withRowData<T extends object>(
  RowComponent: ComponentType<
    HTMLAttributes<HTMLTableRowElement> & { rowData: T }
  >,
) {
  const WrappedRow = (
    props: HTMLAttributes<HTMLTableRowElement> & { "data-row": T },
  ) => {
    const { "data-row": rowData, ...rest } = props;
    return <RowComponent {...rest} rowData={rowData} />;
  };

  WrappedRow.displayName = `withRowData(${
    RowComponent.displayName || RowComponent.name || "RowComponent"
  })`;

  return WrappedRow;
}
