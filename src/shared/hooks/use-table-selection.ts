import { useCallback, useMemo } from "react";
import type { TableProps } from "xiilab-ui";

interface UseTableSelectionReturn<T> {
  selectedKeys: string[];
  hasSelection: boolean;
  clearSelection: () => void;
  rowSelection: TableProps<T>["rowSelection"];
}

export function useTableSelection<T>(
  selectedSet: Set<string>,
  setSelectedSet: (value: Set<string>) => void,
): UseTableSelectionReturn<T> {
  const selectedKeys = useMemo(() => Array.from(selectedSet), [selectedSet]);

  const clearSelection = useCallback(() => {
    setSelectedSet(new Set());
  }, [setSelectedSet]);

  const rowSelection = useMemo<TableProps<T>["rowSelection"]>(
    () => ({
      selectedRowKeys: selectedKeys,
      onChange: (keys) => {
        setSelectedSet(new Set(keys.map(String)));
      },
    }),
    [selectedKeys, setSelectedSet],
  );

  return {
    selectedKeys,
    hasSelection: selectedKeys.length > 0,
    clearSelection,
    rowSelection,
  };
}
