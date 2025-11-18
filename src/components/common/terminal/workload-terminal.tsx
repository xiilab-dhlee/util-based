"use client";

import { useAtomValue } from "jotai";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Split from "split.js";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { terminalThemeAtom } from "@/atoms/common/terminal.atom";
import {
  TERMINAL_MAX_HCNT,
  TERMINAL_MAX_VCNT,
} from "@/constants/common/terminal.constant";
import { createTermBgClasses } from "@/styles/mixins/terminal";
import type { TerminalPaneState } from "@/types/common/terminal.interface";
import { EmptyTerminal } from "./empty-terminal";
import { WorkloadTerminalPane } from "./workload-terminal-pane";

interface SplitableTerminalProps {
  /** 워크스페이스 ID */
  workspaceId: string;
  /** 워크로드 ID */
  workloadId: string;
  /** 워크로드 타입 */
  workloadType: string;
}

/**
 * 분할 가능한 터미널 컴포넌트
 * 수직/수평 방향으로 터미널을 분할하고 크기를 조정할 수 있습니다.
 */
export function WorkloadTerminal({
  workspaceId,
  workloadId,
  workloadType,
}: SplitableTerminalProps) {
  const splitInstance = useRef<Split.Instance | null>(null);

  // 전체 터미널 pane 목록 [paneId, width%, [terminalList]]
  const [panes, setPanes] = useState<TerminalPaneState[]>([
    [uuidv4(), 100, [[uuidv4(), 100]]],
  ]);

  // 현재 포커스된 터미널의 pane 인덱스
  const [focusPosX, setFocusPosX] = useState(0);

  // 현재 포커스된 터미널의 pane 내 인덱스
  const [focusPosY, setFocusPosY] = useState(0);

  // 현재 적용된 터미널 테마
  const resultTheme = useAtomValue(terminalThemeAtom);

  const isActive = workspaceId && workloadId && workloadType;

  /**
   * 특정 터미널에 포커스를 설정합니다.
   * @param x pane 인덱스
   * @param y pane 내 터미널 인덱스
   */
  const handleFocusTerminal = (x: number, y: number) => {
    setFocusPosX(x);
    setFocusPosY(y);
  };

  /**
   * 수직 방향으로 새로운 pane을 추가합니다.
   * 기존 pane들의 너비를 균등하게 분배합니다.
   */
  const handleSplitVertical = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();

    // 최대 수직 분할 수 제한 확인
    if (panes.length >= TERMINAL_MAX_VCNT) {
      return;
    }

    const next: TerminalPaneState[] = [
      ...panes,
      [uuidv4(), 100, [[uuidv4(), 100]]],
    ];

    // 모든 pane의 너비를 균등하게 분배
    for (let i = 0; i < next.length; i++) {
      next[i][1] = Math.floor(100 / next.length);
    }

    setPanes(next);

    // 새로 생성된 pane의 첫 번째 터미널에 포커스
    setFocusPosX(next.length - 1);
    setFocusPosY(0);
  };

  /**
   * 수평 방향으로 현재 pane에 새로운 터미널을 추가합니다.
   * pane 내 모든 터미널의 높이를 균등하게 분배합니다.
   */
  const handleSplitHorizon = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();

    // 최대 수평 분할 수 제한 확인
    if (panes[focusPosX]?.[2]?.length >= TERMINAL_MAX_HCNT) {
      return;
    }

    const next: TerminalPaneState[] = [...panes];

    // 포커스된 pane에 새로운 터미널 추가
    next[focusPosX][2] = [...next[focusPosX][2], [uuidv4(), 100]];

    // pane 내 모든 터미널의 높이를 균등하게 분배
    for (let i = 0; i < next[focusPosX][2].length; i++) {
      const term = next[focusPosX][2][i];
      term[1] = Math.floor(100 / next[focusPosX][2].length);
    }

    setPanes(next);

    // 새로 생성된 터미널에 포커스
    setFocusPosY(next[focusPosX][2].length - 1);
  };

  /**
   * 지정된 위치의 터미널을 제거합니다.
   * pane 내 터미널이 모두 제거되면 pane도 함께 제거합니다.
   * 제거된 터미널이 현재 포커스된 터미널인 경우 첫 번째 터미널로 포커스를 이동합니다.
   */
  const handleDeleteTerminal = (
    evt: MouseEvent<HTMLSpanElement>,
    x: number,
    y: number,
  ) => {
    evt.stopPropagation();

    const next = [...panes];

    // 지정된 위치의 터미널 제거
    next[x][2].splice(y, 1);

    // pane 내 터미널이 없는 경우 pane도 제거
    if (next[x][2].length === 0) {
      next.splice(x, 1);

      // pane이 제거된 경우 남은 pane들의 너비를 균등하게 재분배
      if (next.length > 0) {
        for (let i = 0; i < next.length; i++) {
          next[i][1] = Math.floor(100 / next.length);
        }
      }
    } else {
      // 남은 터미널들의 높이를 균등하게 분배
      for (let i = 0; i < next[x][2].length; i++) {
        next[x][2][i][1] = Math.floor(100 / next[x][2].length);
      }
    }

    setPanes(next);

    // 현재 포커스된 터미널이 제거된 경우 첫 번째 터미널로 포커스 이동
    const isFocus = x === focusPosX && y === focusPosY;
    if (isFocus) {
      outer: for (let i = 0; i < next.length; i++) {
        for (let j = 0; j < next[i][2].length; j++) {
          if (next[i][2][j].length > 0) {
            setFocusPosX(i);
            setFocusPosY(j);
            break outer;
          }
        }
      }
    }
  };

  /**
   * Split.js의 gutter 드래그 완료 시 호출됩니다.
   * 각 pane의 너비를 새로운 크기로 업데이트합니다.
   */
  const handleDragEnd = useCallback(
    (sizes: number[]) => {
      const next = [...panes];
      for (let i = 0; i < sizes.length; i++) {
        next[i][1] = sizes[i];
      }

      setPanes(next);
    },
    [panes],
  );

  /**
   * pane 추가/삭제 시 Split.js 인스턴스를 관리합니다.
   * pane이 2개 이상일 때만 Split.js를 활성화합니다.
   */
  useEffect(() => {
    // 기존 Split 인스턴스 정리
    if (splitInstance.current) {
      splitInstance.current.destroy();
      splitInstance.current = null;
    }

    // pane이 2개 이상일 때 Split.js 활성화
    if (panes.length > 1) {
      const target = Array.from({ length: panes.length }).map(
        (_, i) => `#pane${i}`,
      );

      splitInstance.current = Split(target, {
        sizes: panes.map(([, size]) => size),
        minSize: 250,
        onDragEnd: handleDragEnd,
      });
    }
  }, [panes, handleDragEnd]);

  return (
    <Container className={`split ${resultTheme}`}>
      {isActive ? (
        panes.map(([paneId, size], x) => (
          <WorkloadTerminalPane
            key={paneId}
            x={x}
            paneSize={size}
            panes={panes}
            setPanes={setPanes}
            onFocus={handleFocusTerminal}
            onDelete={handleDeleteTerminal}
            onSplitVertical={handleSplitVertical}
            onSplitHorizon={handleSplitHorizon}
            focusPosX={focusPosX}
            focusPosY={focusPosY}
            workspaceId={workspaceId}
            workloadId={workloadId}
            workloadType={workloadType}
          />
        ))
      ) : (
        <EmptyTerminal />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;

  &.split {
    display: flex;
    flex-direction: row;
  }

  & .gutter {
    background-color: #343537;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  & .gutter.gutter-horizontal {
    // background-image: url('/icons/icon-arrows-horizon.svg');
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
    cursor: col-resize;
  }

  & .gutter.gutter-vertical {
    // background-image: url('/icons/icon-arrows-vertical.svg');
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
    cursor: row-resize;
  }

  ${createTermBgClasses()}
`;
