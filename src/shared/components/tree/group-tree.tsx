"use client";

import type { ComponentType, ReactNode } from "react";
import { createElement, useCallback, useState } from "react";
import styled from "styled-components";

import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
import type { CoreFileIndentPosition } from "@/shared/types/core.interface";
import {
  type GroupTreeButtonProps,
  GroupTreeNode,
  RootGroupTreeNode,
} from "./group-tree-node";

interface GroupTreeProps {
  /** 그룹 트리 데이터 */
  treeData: GroupTreeType[];
  /** 그룹 버튼 컴포넌트 */
  groupButton: ComponentType<GroupTreeButtonProps>;
  /** 계정 버튼 컴포넌트 */
  accountButton: ComponentType<GroupTreeButtonProps>;
  /** 루트 노드 ("전체") 표시 여부 */
  showRootNode?: boolean;
}

interface RenderNodeOptions {
  isSingleRoot: boolean;
}

/**
 * GroupTree 컴포넌트
 *
 * 그룹/계정 구조를 트리 형태로 표시하는 컴포넌트입니다.
 * 계층적 구조를 시각적으로 표현하며, 각 노드의 위치에 따라
 * 연결선과 브리지를 적절히 렌더링합니다.
 */
export function GroupTree({
  treeData,
  groupButton,
  accountButton,
  showRootNode,
}: GroupTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const getNodePosition = (
    index: number,
    totalSiblings: number,
  ): CoreFileIndentPosition => {
    if (index === 0) return "first";
    if (index === totalSiblings - 1) return "last";
    return "middle";
  };

  const shouldCarryBridge = (position: CoreFileIndentPosition): boolean => {
    return position !== "last";
  };

  const renderSingleNode = (
    node: GroupTreeType,
    index: number,
    totalSiblings: number,
    ancestorsHasNext: boolean[],
    options: RenderNodeOptions,
  ): ReactNode => {
    const position = getNodePosition(index, totalSiblings);
    const isExpanded = expandedNodes.has(node.id);
    const isOnlyChild = totalSiblings === 1;

    return (
      <GroupTreeNode
        key={node.id}
        node={node}
        position={position}
        ancestorsHasNext={ancestorsHasNext}
        groupButton={groupButton}
        accountButton={accountButton}
        isExpanded={isExpanded}
        onToggleExpansion={toggleNodeExpansion}
        isSingleRoot={options.isSingleRoot}
        isOnlyChild={isOnlyChild}
      />
    );
  };

  const renderChildren = (
    node: GroupTreeType,
    position: CoreFileIndentPosition,
    ancestorsHasNext: boolean[],
    options: RenderNodeOptions,
    isOnlyChild: boolean,
  ): ReactNode[] => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    if (!hasChildren || !isExpanded) {
      return [];
    }

    const updatedAncestors = [
      ...ancestorsHasNext,
      isOnlyChild ? false : shouldCarryBridge(position),
    ];

    return renderNodes(node.children, updatedAncestors, options);
  };

  const renderNodes = (
    nodes: GroupTreeType[],
    ancestorsHasNext: boolean[] = [],
    options?: RenderNodeOptions,
  ): ReactNode[] => {
    const renderOptions = options || { isSingleRoot: nodes.length === 1 };

    return nodes.flatMap((node, index) => {
      const totalSiblings = nodes.length;
      const position = getNodePosition(index, totalSiblings);
      const isOnlyChild = totalSiblings === 1;

      const currentNode = renderSingleNode(
        node,
        index,
        totalSiblings,
        ancestorsHasNext,
        renderOptions,
      );

      const childrenNodes = renderChildren(
        node,
        position,
        ancestorsHasNext,
        renderOptions,
        isOnlyChild,
      );

      return [currentNode, ...childrenNodes];
    });
  };

  const renderRootNode = (): ReactNode => (
    <RootGroupTreeNode>
      {createElement(groupButton, {
        id: ALL_OPTION.value,
        name: "전체",
      })}
    </RootGroupTreeNode>
  );

  return (
    <Container>
      {showRootNode && renderRootNode()}
      {renderNodes(treeData)}
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
`;
