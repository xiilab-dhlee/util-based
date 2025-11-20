"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Split from "split.js";
import styled from "styled-components";

import {
  TERMINAL_MAX_HCNT,
  TERMINAL_MAX_VCNT,
} from "@/shared/constants/terminal.constant";
import type {
  TerminalEventProps,
  TerminalPaneState,
} from "@/shared/types/terminal.interface";
import { WorkloadTerminalNode } from "./workload-terminal-node";

// const WorkloadTerminalNode = dynamic(() => import("./workload-terminal-node"), {
//   ssr: false,
// });

/**
 * TerminalPane 컴포넌트의 Props 인터페이스
 * 터미널 창의 수직 분할을 관리하는 컴포넌트
 */
interface WorkloadTermianlPaneProps extends TerminalEventProps {
  /** panes 목록 - 전체 터미널 창 구조 */
  panes: TerminalPaneState[];
  /** panes 상태를 업데이트하는 함수 */
  setPanes: Dispatch<SetStateAction<TerminalPaneState[]>>;
  /** 현재 포커싱된 터미널의 X 좌표 */
  focusPosX: number;
  /** 현재 포커싱된 터미널의 Y 좌표 */
  focusPosY: number;
  /** 터미널 너비 수치 백분율(%) */
  paneSize: number;
  /** 터미널 창의 X 좌표 (수직 분할에서의 위치) */
  x: number;
  /** 워크스페이스 ID */
  workspaceId: string;
  /** 워크로드 ID */
  workloadId: string;
  /** 워크로드 타입 */
  workloadType: string;
}

/**
 * TerminalPane 컴포넌트
 *
 * 터미널 창의 수직 분할을 관리하며, 각 창 내에서 터미널을 수평으로 분할할 수 있습니다.
 * Split.js를 사용하여 드래그로 터미널 크기를 조절할 수 있습니다.
 *
 * @param x - 터미널 창의 X 좌표
 * @param paneSize - 창의 너비 백분율
 * @param panes - 전체 터미널 창 구조
 * @param setPanes - panes 상태 업데이트 함수
 * @param onFocus - 터미널 포커스 이벤트 핸들러
 * @param onDelete - 터미널 삭제 이벤트 핸들러
 * @param focusPosX - 현재 포커스된 X 좌표
 * @param focusPosY - 현재 포커스된 Y 좌표
 * @param onSplitVertical - 수직 분할 이벤트 핸들러
 * @param onSplitHorizon - 수평 분할 이벤트 핸들러
 */
export function WorkloadTerminalPane({
  x,
  paneSize,
  panes,
  setPanes,
  onFocus,
  onDelete,
  focusPosX,
  focusPosY,
  onSplitVertical,
  onSplitHorizon,
  workspaceId,
  workloadId,
  workloadType,
}: WorkloadTermianlPaneProps) {
  // 현재 pane 내의 터미널 목록
  const terminals = panes[x][2];
  // 전체 터미널 수 (모든 pane의 터미널 합계)
  const totalTermCount = panes.reduce((acc, cur) => acc + cur[2].length, 0);

  // Split.js 인스턴스를 저장하는 ref
  const splitInstance = useRef<Split.Instance | null>(null);
  // 드래그 중인지 여부를 추적하는 ref
  const isDragRef = useRef(false);

  /**
   * 드래그 시작 시 호출되는 핸들러
   * 드래그 상태를 true로 설정
   */
  const handleDragStart = useCallback(() => {
    isDragRef.current = true;
  }, []);

  /**
   * 드래그 종료 시 호출되는 핸들러
   * 터미널 크기 변경을 반영하여 panes 상태를 업데이트
   *
   * @param sizes - 각 터미널의 새로운 크기 배열 (백분율)
   */
  const handleDragEnd = useCallback(
    (sizes: number[]) => {
      const next = [...panes];
      const nextTerms = [...terminals];

      // 터미널의 수평 크기 업데이트
      for (let i = 0; i < sizes.length; i++) {
        nextTerms[i][1] = Math.round(sizes[i]);
      }

      // 현재 pane의 터미널 목록 업데이트
      next[x][2] = nextTerms;
      setPanes(next);

      // 드래그 상태 초기화
      isDragRef.current = false;
    },
    [panes, terminals, x, setPanes],
  );

  /**
   * pane 추가 및 삭제 시 Split.js 인스턴스를 관리하는 effect
   * 터미널 개수나 pane 개수가 변경될 때마다 실행
   */
  useEffect(() => {
    // 기존 Split 인스턴스가 있다면 제거
    if (splitInstance.current) {
      splitInstance.current.destroy();
      splitInstance.current = null;
    }

    // 터미널이 2개 이상일 때만 split 기능 활성화
    if (terminals.length > 1) {
      // 각 터미널의 DOM 요소 ID 배열 생성
      const target = Array.from({ length: terminals.length }).map(
        (_, i) => `#pane${x}-term${i}`,
      );

      // Split.js 인스턴스 생성 및 설정
      splitInstance.current = Split(target, {
        sizes: terminals.map(([, size]) => size), // 현재 터미널 크기로 초기화
        minSize: 0, // 최소 크기 제한 없음
        direction: "vertical", // 수직 방향으로 분할
        onDragStart: handleDragStart, // 드래그 시작 핸들러
        onDragEnd: handleDragEnd, // 드래그 종료 핸들러
      });
    }
  }, [
    terminals.length,
    // panes.length,
    x,
    handleDragStart,
    handleDragEnd,
    terminals,
  ]);

  return (
    <Container
      id={`pane${x}`}
      className={`split ${terminals.length > 1 ? "multiple" : ""} ${
        isDragRef.current ? "dragging" : ""
      }`}
      $paneSize={paneSize}
    >
      {/* 각 터미널을 TerminalNode 컴포넌트로 렌더링 */}
      {terminals.map(([id], y) => {
        return (
          <WorkloadTerminalNode
            key={id}
            x={x}
            y={y}
            isSingle={totalTermCount === 1} // 전체 터미널이 1개인지 여부
            isFocus={x === focusPosX && y === focusPosY} // 현재 포커스된 터미널인지 여부
            onFocus={onFocus}
            onDelete={onDelete}
            onSplitVertical={onSplitVertical}
            onSplitHorizon={onSplitHorizon}
            // 수평 분할 버튼 표시 여부 (마지막 터미널이고 최대 개수에 도달하지 않았을 때)
            isShowAddHorizon={
              terminals.length - 1 === y &&
              TERMINAL_MAX_HCNT !== terminals.length
            }
            // 수직 분할 버튼 표시 여부 (마지막 pane이고 최대 개수에 도달하지 않았을 때)
            isShowAddVertical={
              panes.length - 1 === x && TERMINAL_MAX_VCNT !== panes.length
            }
            workspaceId={workspaceId}
            workloadId={workloadId}
            workloadType={workloadType}
          />
        );
      })}
    </Container>
  );
}

/**
 * TerminalPane 컴포넌트의 스타일드 컴포넌트
 *
 * @param $paneSize - 창의 너비 백분율
 */
const Container = styled.div<{ $paneSize: number }>`
  display: flex;
  flex-direction: column;
  width: ${({ $paneSize }) => `${$paneSize}%`};
  height: 100%;
  min-height: 0;
  background-color: transparent;

  /* 여러 터미널이 있을 때의 스타일 */
  &.multiple {
    height: 100%;
  }

  /* 드래그 중일 때의 스타일 */
  &.dragging {
    height: auto !important;
  }
`;
