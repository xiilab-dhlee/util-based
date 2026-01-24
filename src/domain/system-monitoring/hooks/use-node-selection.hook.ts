"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface NodeOption {
  value: string;
  label: string;
}

interface UseNodeSelectionReturn {
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
  handleChangeNode: (value: string | null) => void;
}

/**
 * 노드 선택 상태를 관리하는 훅
 *
 * - 노드 목록이 로딩되면 첫 번째 노드를 자동 선택
 * - 노드 변경 핸들러 제공
 */
export function useNodeSelection(
  nodeOptions: NodeOption[],
): UseNodeSelectionReturn {
  const [selectedNode, setSelectedNode] = useState<string>("");

  // 노드 목록 로딩 완료 시 첫 번째 노드 자동 선택
  useEffect(() => {
    if (nodeOptions.length > 0 && !selectedNode) {
      setSelectedNode(nodeOptions[0].value);
    }
  }, [nodeOptions, selectedNode]);

  const handleChangeNode = (value: string | null) => {
    if (!value) return;
    setSelectedNode(value);
  };

  return {
    selectedNode,
    setSelectedNode,
    handleChangeNode,
  };
}
