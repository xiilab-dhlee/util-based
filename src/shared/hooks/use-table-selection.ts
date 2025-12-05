import type { Key } from "react";
import { useCallback, useMemo } from "react";
import type { TableProps } from "xiilab-ui";

interface UseTableSelectionReturn<T, K extends Key> {
  selectedKeys: K[];
  hasSelection: boolean;
  clearSelection: () => void;
  rowSelection: TableProps<T>["rowSelection"];
}

export function useTableSelection<T, K extends Key = string>(
  selectedSet: Set<K>,
  setSelectedSet: (value: Set<K>) => void,
): UseTableSelectionReturn<T, K> {
  const selectedKeys = useMemo<K[]>(
    () => Array.from(selectedSet),
    [selectedSet],
  );

  const clearSelection = useCallback(() => {
    setSelectedSet(new Set());
  }, [setSelectedSet]);

  const rowSelection = useMemo<TableProps<T>["rowSelection"]>(
    () => ({
      selectedRowKeys: selectedKeys,
      onChange: (keys) => {
        setSelectedSet(new Set(keys as K[]));
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
