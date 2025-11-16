"use client";

import classNames from "classnames";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { createElement } from "react";
import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";
import type { FileTreeType } from "@/schemas/filetree.schema";
import type { CoreFileIndentPosition } from "@/types/common/core.interface";
import type { CoreFileButton } from "@/types/common/core.model";

/**
 * CustomFileNode 컴포넌트의 props 인터페이스
 */
interface FileNodeProps {
  /** 파일/디렉토리 노드 데이터 */
  node: FileTreeType;
  /** 노드의 위치 (first: 첫 번째, middle: 중간, last: 마지막) */
  position: CoreFileIndentPosition;
  /** 상위 노드들의 브리지 상태 배열 (true: 브리지 연결됨, false: 브리지 없음) */
  ancestorsHasNext: boolean[];
  /** 파일 체크박스 컴포넌트 타입 (옵셔널) */
  fileCheckbox?: ComponentType<{ activeKey: string }>;
  /** 파일 버튼 컴포넌트 타입 */
  fileButton: ComponentType<CoreFileButton>;
  /** 노드가 확장된 상태인지 여부 */
  isExpanded: boolean;
  /** 노드 확장/축소 상태를 토글하는 콜백 함수 */
  onToggleExpansion: (nodePath: string) => void;
  /** 루트 노드가 하나만 있는지 여부 */
  isSingleRoot: boolean;
  /** 유일한 자식 노드인지 여부 */
  isOnlyChild: boolean;
}

/**
 * RootCustomFileNode 컴포넌트
 *
 * 파일 트리의 최상위 노드로, "전체" 선택 기능을 제공합니다.
 * 사용자가 클릭하면 모든 파일을 선택할 수 있으며,
 * 리스트 아이콘과 함께 표시됩니다.
 *
 * @param children - 루트 노드에 렌더링할 자식 컴포넌트
 * @returns 루트 노드 UI
 */
export function RootCustomFileNode({ children }: PropsWithChildren) {
  return (
    <Container>
      <ListIconWrapper>
        <MyIcon name="FormatListBulleted" color="#fff" size={20} />
      </ListIconWrapper>
      {children}
    </Container>
  );
}

/**
 * CustomFileNode 컴포넌트
 *
 * 파일 트리의 개별 노드를 렌더링하는 컴포넌트입니다.
 * 파일과 디렉토리를 구분하여 표시하며, 계층 구조를 시각적으로 표현합니다.
 *
 * 주요 기능:
 * - 파일/디렉토리 구분 표시 (아이콘, 체크박스)
 * - 계층적 들여쓰기 가이드 렌더링
 * - 브리지 연결선을 통한 트리 구조 시각화
 * - 파일 선택 기능 (체크박스)
 * - 노드 선택 기능 (버튼)
 * - 디렉토리 아이콘 회전 기능
 *
 * @param node - 파일/디렉토리 노드 데이터
 * @param position - 노드의 위치 (first, middle, last)
 * @param ancestorsHasNext - 상위 노드들의 브리지 상태 배열
 * @param fileCheckbox - 파일 체크박스 컴포넌트 타입
 * @param fileButton - 파일 버튼 컴포넌트 타입
 * @returns 파일 노드 UI
 */
export function CustomFileNode({
  node,
  position,
  ancestorsHasNext,
  fileCheckbox,
  fileButton,
  isExpanded,
  onToggleExpansion,
  isSingleRoot,
  isOnlyChild,
}: FileNodeProps) {
  /**
   * 디렉토리 아이콘 클릭 핸들러
   *
   * 아이콘을 클릭하면 상위 컴포넌트의 확장/축소 상태를 토글합니다.
   */
  const handleIconClick = () => {
    onToggleExpansion(node.path);
  };

  /**
   * 상위 노드들의 들여쓰기 가이드를 렌더링하는 함수
   *
   * 상위 노드들이 브리지를 가지고 있는 경우 세로 연결선을 렌더링합니다.
   * 이를 통해 트리의 계층 구조를 시각적으로 표현합니다.
   * ancestorsHasNext 배열의 값이 false인 경우 해당 Indent는 빈 공간으로 렌더링됩니다.
   *
   * @param ancestorsHasNext - 상위 노드들의 브리지 상태 배열
   * @returns 들여쓰기 가이드 React 노드 배열
   */
  const renderAncestorIndents = (
    ancestorsHasNext: boolean[],
  ): React.ReactNode[] => {
    return ancestorsHasNext.map((hasNext, idx) => {
      // 루트 노드가 하나만 있고 첫 번째 Indent인 경우에만 추가로 숨김
      const shouldHideFirstIndent = idx === 0 && isSingleRoot;

      return (
        <Indent key={`a-${idx}`}>
          {!shouldHideFirstIndent && hasNext ? <IndentBridge /> : null}
        </Indent>
      );
    });
  };

  /**
   * 현재 레벨의 들여쓰기 가이드를 렌더링하는 함수
   *
   * 노드의 위치에 따라 적절한 들여쓰기 가이드를 렌더링합니다:
   * - first: 시작점만 렌더링 (깊이 2 이상일 때 브리지 추가)
   * - middle: 시작점과 브리지 렌더링
   * - last: 끝점만 렌더링
   * - 유일한 자식 (depth >= 2): IndentEnd 표시 (상위 indent는 빈 공간)
   * - 루트 노드가 하나만 있고 depth가 1: 빈 공간
   *
   * @param position - 노드의 위치 (first, middle, last)
   * @param depth - 현재 깊이
   * @returns 현재 레벨 들여쓰기 가이드 React 노드 배열
   */
  const renderCurrentLevelIndent = (
    position: CoreFileIndentPosition,
    depth: number,
  ): ReactNode[] => {
    // 루트 노드가 하나만 있고 depth가 1인 경우 빈 공간
    if (isSingleRoot && depth === 1) {
      return [];
    }

    // 유일한 자식이고 depth >= 2인 경우 IndentEnd 표시
    if (isOnlyChild && depth >= 2) {
      return [<IndentEnd key="end" />];
    }

    // 나머지는 기존 position 기반 로직
    if (position === "last") {
      return [<IndentEnd key="end" />];
    }
    if (position === "middle") {
      return [<IndentStart key="start" />, <IndentBridge key="bridge" />];
    }
    // first
    return depth >= 2
      ? [<IndentStart key="start" />, <IndentBridge key="bridge" />]
      : [<IndentStart key="start" />];
  };

  /**
   * 전체 들여쓰기 가이드를 렌더링하는 함수
   *
   * 조상 레벨의 세로 가이드와 현재 레벨의 가이드를 조합하여
   * 완전한 들여쓰기 가이드를 생성합니다.
   *
   * @param ancestorsHasNext - 상위 노드들의 브리지 상태 배열
   * @param position - 노드의 위치
   * @returns 전체 들여쓰기 가이드 React 노드 배열
   */
  const renderIndents = (
    ancestorsHasNext: boolean[],
    position: CoreFileIndentPosition,
  ) => {
    const depth = ancestorsHasNext.length + 1;

    // 1) 조상 레벨의 세로 가이드 (depth - 1)
    const ancestorIndents = renderAncestorIndents(ancestorsHasNext);

    // 2) 현재 레벨의 가이드 (depth)
    const currentLevelChildren = renderCurrentLevelIndent(position, depth);

    return [
      ...ancestorIndents,
      <Indent key={`c-${ancestorsHasNext.length}`}>
        {currentLevelChildren}
      </Indent>,
    ];
  };

  /**
   * 디렉토리 내용을 렌더링하는 함수
   *
   * 디렉토리 노드의 경우 CaretDown 아이콘과 파일 버튼을 렌더링합니다.
   * 디렉토리는 체크박스 없이 버튼만 제공하며, 아이콘 클릭 시 회전합니다.
   *
   * @param path - 디렉토리 경로
   * @param name - 디렉토리 이름
   * @returns 디렉토리 UI
   */
  const renderDirectoryContent = (path: string, name: string): ReactNode => (
    <>
      <IconWrapper
        type="button"
        className={classNames({
          rotated: isExpanded,
        })}
        onClick={handleIconClick}
      >
        <MyIcon name="CaretDown" color="var(--icon-fill)" size={16} />
      </IconWrapper>
      {createElement(fileButton, {
        activeKey: path,
        fileName: name,
      })}
    </>
  );

  /**
   * 파일 내용을 렌더링하는 함수
   *
   * 파일 노드의 경우 체크박스(옵셔널), File 아이콘, 파일 버튼을 렌더링합니다.
   * fileCheckbox가 전달된 경우에만 체크박스를 표시합니다.
   * 파일은 선택 기능과 체크 기능을 모두 제공합니다.
   *
   * @param path - 파일 경로
   * @param name - 파일 이름
   * @returns 파일 UI
   */
  const renderFileContent = (id: string, name: string): React.ReactNode => (
    <FileNameWrapper>
      {fileCheckbox ? (
        <CheckboxWrapper>
          {createElement(fileCheckbox as ComponentType<{ activeKey: string }>, {
            activeKey: id,
          })}
        </CheckboxWrapper>
      ) : null}
      {createElement(fileButton, {
        activeKey: id,
        fileName: name,
        showIcon: true,
      })}
    </FileNameWrapper>
  );

  // 들여쓰기 가이드와 노드 타입을 계산
  const indents = renderIndents(ancestorsHasNext, position);
  const isDirectory = node.type === "directory";

  return (
    <Container>
      {/* 들여쓰기 가이드 렌더링 */}
      {indents}
      {/* 노드 타입에 따라 다른 내용 렌더링 */}
      {isDirectory
        ? renderDirectoryContent(node.path, node.name)
        : renderFileContent(node.id, node.name)}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  --file-indent-size: 24px;
  --file-leaf-size: 12px;
  --file-leaf-border-color: #d6deee;
`;

const IconWrapper = styled.button`
  width: var(--file-indent-size);
  height: var(--file-indent-size);
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

const CheckboxWrapper = styled.div`
  width: var(--file-indent-size);
  height: var(--file-indent-size);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Indent = styled.div`
  min-width: var(--file-indent-size);
  height: var(--file-indent-size);
  position: relative;
`;

const IndentStart = styled.div`
  position: absolute;
  top: 50%;
  left: var(--file-leaf-size);
  border-top: 1px solid var(--file-leaf-border-color);
  border-left: 1px solid var(--file-leaf-border-color);
  width: var(--file-leaf-size);
  height: var(--file-leaf-size);
`;

const IndentBridge = styled.div`
  position: absolute;
  left: var(--file-leaf-size);
  border-left: 1px solid var(--file-leaf-border-color);
  width: var(--file-leaf-size);
  height: 100%;
`;

const IndentEnd = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  border-bottom: 1px solid var(--file-leaf-border-color);
  border-left: 1px solid var(--file-leaf-border-color);
  width: var(--file-leaf-size);
  height: var(--file-leaf-size);
`;

const FileNameWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  height: 100%;
`;
