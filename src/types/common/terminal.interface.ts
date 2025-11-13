/**
 * 터미널에서 사용되는 공통 인터페이스를 정의
 *
 */

import type { MouseEvent } from "react";

// 터미널 상태(id, size)
export type TerminalState = [string, number];
// 터미널 열(id, size, state)
export type TerminalPaneState = [string, number, TerminalState[]];

export type TerminalActionType =
  | "TERMINAL_HOST"
  | "TERMINAL_INIT"
  | "TERMINAL_COMMAND"
  | "TERMINAL_RESIZE"
  | "TERMINAL_HELP";

export type TerminalActionData = {
  namespace?: string;
  podName?: string;
  command?: string;
  columns?: number;
  rows?: number;

  width?: number;
  height?: number;

  /* new */
  workspace?: string;
  workload?: string;
  workloadType?: string;
};

export interface TerminalEventProps {
  // 터미널 클릭 이벤트
  onFocus?: (x: number, y: number) => void;
  // 터미널 제거 이벤트
  onDelete?: (evt: MouseEvent<HTMLSpanElement>, x: number, y: number) => void;
  // 터미널 분할 이벤트 - 수직
  onSplitVertical: (evt: MouseEvent<HTMLButtonElement>) => void;
  // 터미널 분할 이벤트 - 수평
  onSplitHorizon: (evt: MouseEvent<HTMLButtonElement>) => void;
}
