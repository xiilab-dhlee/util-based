"use client";

import type { ComponentType, ReactNode } from "react";
import { createElement, useState } from "react";
import styled from "styled-components";

import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import type { CoreFileIndentPosition } from "@/shared/types/core.interface";
import { CustomFileNode, RootCustomFileNode } from "./custom-file-node";

/** 파일 체크박스 컴포넌트 props 인터페이스 */
export interface FileCheckboxProps {
  /** 체크박스가 연결된 파일/디렉토리의 고유 키 (경로) */
  activeKey: string;
  /** 노드 타입 (file 또는 directory) */
  type: "file" | "directory";
  /** 노드 데이터 (하위 노드 접근용) */
  node: FileTreeType;
}

interface CustomFileTreeProps {
  treeData: FileTreeType[];
  fileCheckbox?: ComponentType<FileCheckboxProps>;
  fileButton: ComponentType<{
    fileName: string;
    activeKey: string;
    path?: string;
    type?: "file" | "directory";
    onFolderClick?: (path: string) => void;
  }>;
  /** 전체 선택 활성화 여부 */
  isActiveRootNode?: boolean;
  /** 현재 로딩 중인 경로들 (스피너 표시용) */
  loadingPaths?: Set<string>;
  /** 폴더 클릭 시 호출되는 콜백 (lazy loading용) */
  onFolderClick?: (path: string) => void;
}

interface RenderNodeOptions {
  isSingleRoot: boolean;
}

/**
 * CustomFileTree 컴포넌트
 *
 * 파일 구조를 트리 형태로 표시하는 컴포넌트입니다.
 * 계층적 파일 구조를 시각적으로 표현하며, 각 노드의 위치에 따라
 * 연결선과 브리지를 적절히 렌더링합니다.
 */
export function CustomFileTree({
  treeData,
  fileCheckbox,
  fileButton,
  isActiveRootNode,
  loadingPaths,
  onFolderClick,
}: CustomFileTreeProps) {
  // 각 노드의 확장/축소 상태를 관리
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  /**
   * 노드의 확장/축소 상태를 토글하는 함수
   * 확장 시 onFolderClick 콜백을 호출하여 lazy loading을 트리거합니다.
   */
  const toggleNodeExpansion = (nodePath: string) => {
    const wasExpanded = expandedNodes.has(nodePath);

    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });

    // 확장 시에만 폴더 클릭 콜백 호출 (setExpandedNodes 외부에서 호출)
    if (!wasExpanded) {
      onFolderClick?.(nodePath);
    }
  };

  /**
   * 노드의 위치를 결정하는 함수
   *
   * @param index - 현재 노드의 인덱스
   * @param totalSiblings - 전체 형제 노드의 개수
   * @returns 노드의 위치 (first, middle, last)
   */
  const getNodePosition = (
    index: number,
    totalSiblings: number,
  ): CoreFileIndentPosition => {
    if (index === 0) return "first";
    if (index === totalSiblings - 1) return "last";
    return "middle";
  };

  /**
   * 노드가 브리지를 이어받아야 하는지 확인하는 함수
   *
   * @param position - 노드의 위치
   * @returns 브리지를 이어받아야 하면 true
   */
  const shouldCarryBridge = (position: CoreFileIndentPosition): boolean => {
    return position !== "last";
  };

  /**
   * 단일 노드를 렌더링하는 함수
   *
   * @param node - 렌더링할 노드
   * @param index - 노드의 인덱스
   * @param totalSiblings - 전체 형제 노드 수
   * @param ancestorsHasNext - 상위 노드들의 브리지 상태
   * @param options - 렌더링 옵션
   * @returns 렌더링된 노드
   */
  const renderSingleNode = (
    node: FileTreeType,
    index: number,
    totalSiblings: number,
    ancestorsHasNext: boolean[],
    options: RenderNodeOptions,
  ): ReactNode => {
    const position = getNodePosition(index, totalSiblings);
    const isExpanded = expandedNodes.has(node.path);
    // 유일한 자식 노드인지 확인
    const isOnlyChild = totalSiblings === 1;
    // 현재 노드가 로딩 중인지 확인
    const isLoading = loadingPaths?.has(node.path) ?? false;

    return (
      <CustomFileNode
        key={node.path}
        node={node}
        position={position}
        ancestorsHasNext={ancestorsHasNext}
        fileButton={fileButton}
        fileCheckbox={fileCheckbox}
        isExpanded={isExpanded}
        onToggleExpansion={toggleNodeExpansion}
        isSingleRoot={options.isSingleRoot}
        isOnlyChild={isOnlyChild}
        isLoading={isLoading}
      />
    );
  };

  /**
   * 노드의 자식들을 렌더링하는 함수
   *
   * @param node - 부모 노드
   * @param position - 부모 노드의 위치
   * @param ancestorsHasNext - 상위 노드들의 브리지 상태
   * @param options - 렌더링 옵션
   * @param isOnlyChild - 현재 노드가 유일한 자식인지 여부
   * @returns 렌더링된 자식 노드들
   */
  const renderChildren = (
    node: FileTreeType,
    position: CoreFileIndentPosition,
    ancestorsHasNext: boolean[],
    options: RenderNodeOptions,
    isOnlyChild: boolean,
  ): ReactNode[] => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.path);

    if (!hasChildren || !isExpanded) {
      return [];
    }

    // 현재 노드가 유일한 자식이면 브리지를 전달하지 않음 (false)
    // 이렇게 하면 자식 노드를 그릴 때 이전 depth의 indent가 빈 공간으로 표시됨
    const updatedAncestors = [
      ...ancestorsHasNext,
      isOnlyChild ? false : shouldCarryBridge(position),
    ];

    return renderNodes(node.children, updatedAncestors, options);
  };

  /**
   * 파일 노드들을 재귀적으로 렌더링하는 함수
   *
   * @param nodes - 렌더링할 파일 노드 배열
   * @param ancestorsHasNext - 상위 노드들의 브리지 상태 배열
   * @param options - 렌더링 옵션
   * @returns 렌더링된 React 노드 배열
   */
  const renderNodes = (
    nodes: FileTreeType[],
    ancestorsHasNext: boolean[] = [],
    options?: RenderNodeOptions,
  ): ReactNode[] => {
    const renderOptions = options || { isSingleRoot: nodes.length === 1 };

    return nodes.flatMap((node, index) => {
      const totalSiblings = nodes.length;
      const position = getNodePosition(index, totalSiblings);
      const isOnlyChild = totalSiblings === 1;

      // 현재 노드 렌더링
      const currentNode = renderSingleNode(
        node,
        index,
        totalSiblings,
        ancestorsHasNext,
        renderOptions,
      );

      // 자식 노드들 렌더링
      const childrenNodes = renderChildren(
        node,
        position,
        ancestorsHasNext,
        renderOptions,
        isOnlyChild,
      );

      // 현재 노드와 자식 노드들을 배열로 반환
      return [currentNode, ...childrenNodes];
    });
  };

  /**
   * 루트 노드를 렌더링하는 함수
   */
  const renderRootNode = (): ReactNode => (
    <RootCustomFileNode>
      {createElement(fileButton, {
        activeKey: ALL_OPTION.value,
        fileName: "전체",
      })}
    </RootCustomFileNode>
  );

  return (
    <Container>
      {isActiveRootNode && renderRootNode()}
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
