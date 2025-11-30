"use client";

import classNames from "classnames";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { createElement } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
import { GROUP_TREE_NODE_TYPE } from "@/shared/schemas/group-tree.schema";
import type { CoreFileIndentPosition } from "@/shared/types/core.interface";

/**
 * 그룹 트리 버튼 컴포넌트 props
 */
export interface GroupTreeButtonProps {
  /** 노드 ID */
  id: string;
  /** 노드 표시 이름 */
  name: string;
}

/**
 * GroupTreeNode 컴포넌트의 props 인터페이스
 */
interface GroupTreeNodeProps {
  /** 그룹/계정 노드 데이터 */
  node: GroupTreeType;
  /** 노드의 위치 (first: 첫 번째, middle: 중간, last: 마지막) */
  position: CoreFileIndentPosition;
  /** 상위 노드들의 브리지 상태 배열 */
  ancestorsHasNext: boolean[];
  /** 그룹 버튼 컴포넌트 */
  groupButton: ComponentType<GroupTreeButtonProps>;
  /** 계정 버튼 컴포넌트 */
  accountButton: ComponentType<GroupTreeButtonProps>;
  /** 노드가 확장된 상태인지 여부 */
  isExpanded: boolean;
  /** 노드 확장/축소 상태를 토글하는 콜백 함수 */
  onToggleExpansion: (nodeId: string) => void;
  /** 루트 노드가 하나만 있는지 여부 */
  isSingleRoot: boolean;
  /** 유일한 자식 노드인지 여부 */
  isOnlyChild: boolean;
}

/**
 * RootGroupTreeNode 컴포넌트
 *
 * 그룹 트리의 최상위 노드로, "전체" 선택 기능을 제공합니다.
 */
export function RootGroupTreeNode({ children }: PropsWithChildren) {
  return (
    <Container>
      <ListIconWrapper>
        <Icon name="FormatListBulleted" color="#fff" size={20} />
      </ListIconWrapper>
      {children}
    </Container>
  );
}

/**
 * GroupTreeNode 컴포넌트
 *
 * 그룹 트리의 개별 노드를 렌더링하는 컴포넌트입니다.
 * 그룹과 계정을 구분하여 표시하며, 계층 구조를 시각적으로 표현합니다.
 */
export function GroupTreeNode({
  node,
  position,
  ancestorsHasNext,
  groupButton,
  accountButton,
  isExpanded,
  onToggleExpansion,
  isSingleRoot,
  isOnlyChild,
}: GroupTreeNodeProps) {
  const handleIconClick = () => {
    onToggleExpansion(node.id);
  };

  /**
   * 상위 노드들의 들여쓰기 가이드를 렌더링
   */
  const renderAncestorIndents = (
    ancestorsHasNext: boolean[],
  ): React.ReactNode[] => {
    return ancestorsHasNext.map((hasNext, idx) => {
      const shouldHideFirstIndent = idx === 0 && isSingleRoot;

      return (
        <Indent key={`ancestor-${node.id}-${idx}`}>
          {!shouldHideFirstIndent && hasNext ? <IndentBridge /> : null}
        </Indent>
      );
    });
  };

  /**
   * 현재 레벨의 들여쓰기 가이드를 렌더링
   */
  const renderCurrentLevelIndent = (
    position: CoreFileIndentPosition,
    depth: number,
  ): ReactNode[] => {
    if (isSingleRoot && depth === 1) {
      return [];
    }

    if (isOnlyChild && depth >= 2) {
      return [<IndentEnd key="end" />];
    }

    if (position === "last") {
      return [<IndentEnd key="end" />];
    }
    if (position === "middle") {
      return [<IndentStart key="start" />, <IndentBridge key="bridge" />];
    }
    return depth >= 2
      ? [<IndentStart key="start" />, <IndentBridge key="bridge" />]
      : [<IndentStart key="start" />];
  };

  /**
   * 전체 들여쓰기 가이드를 렌더링
   */
  const renderIndents = (
    ancestorsHasNext: boolean[],
    position: CoreFileIndentPosition,
  ) => {
    const depth = ancestorsHasNext.length + 1;
    const ancestorIndents = renderAncestorIndents(ancestorsHasNext);
    const currentLevelChildren = renderCurrentLevelIndent(position, depth);

    return [
      ...ancestorIndents,
      <Indent key={`current-level-${node.id}-${depth}`}>
        {currentLevelChildren}
      </Indent>,
    ];
  };

  /**
   * 그룹 노드 내용 렌더링
   */
  const renderGroupContent = (id: string, name: string): ReactNode => (
    <>
      <IconWrapper
        type="button"
        className={classNames({ rotated: isExpanded })}
        onClick={handleIconClick}
      >
        <Icon name="CaretDown" color="var(--icon-fill)" size={16} />
      </IconWrapper>
      {createElement(groupButton, { id, name })}
    </>
  );

  /**
   * 계정 노드 내용 렌더링
   */
  const renderAccountContent = (id: string, name: string): ReactNode => (
    <AccountWrapper>
      {createElement(accountButton, { id, name })}
    </AccountWrapper>
  );

  const indents = renderIndents(ancestorsHasNext, position);
  const isGroup = node.nodeType === GROUP_TREE_NODE_TYPE.group;

  return (
    <Container>
      {indents}
      {isGroup
        ? renderGroupContent(node.id, node.name)
        : renderAccountContent(node.id, node.name)}
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  --tree-indent-size: 24px;
  --tree-leaf-size: 12px;
  --tree-leaf-border-color: #d6deee;
`;

const IconWrapper = styled.button`
  width: var(--tree-indent-size);
  height: var(--tree-indent-size);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;

  --icon-fill: #9da6bc;

  &:hover {
    --icon-fill: #000;
  }

  &.rotated {
    transform: rotate(180deg);
  }
`;

const ListIconWrapper = styled(IconWrapper)`
  background-color: #37455e;
  border-radius: 2px;
  margin-right: 6px;
`;

const Indent = styled.div`
  min-width: var(--tree-indent-size);
  height: var(--tree-indent-size);
  position: relative;
`;

const IndentStart = styled.div`
  position: absolute;
  top: 50%;
  left: var(--tree-leaf-size);
  border-top: 1px solid var(--tree-leaf-border-color);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: var(--tree-leaf-size);
`;

const IndentBridge = styled.div`
  position: absolute;
  left: var(--tree-leaf-size);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: 100%;
`;

const IndentEnd = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  border-bottom: 1px solid var(--tree-leaf-border-color);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: var(--tree-leaf-size);
`;

const AccountWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  height: 100%;
`;
