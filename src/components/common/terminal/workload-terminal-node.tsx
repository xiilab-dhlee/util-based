"use client";

import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerminal } from "@xterm/xterm";
import c from "ansi-colors";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Arthur } from "xterm-theme";

import { terminalThemeAtom } from "@/atoms/common/terminal.atom";
import { MyIcon } from "@/components/common/icon";
import { TERMINAL_THEME_LIST } from "@/constants/common/terminal.constant";
import {
  createTermBgClasses,
  createTermFgClasses,
} from "@/styles/mixins/terminal";
import type { TerminalEventProps } from "@/types/common/terminal.interface";

/**
 * TerminalNode 컴포넌트의 Props 인터페이스
 * 개별 터미널 노드를 렌더링하고 관리하는 컴포넌트
 */
interface WorkloadTerminalNodeProps extends TerminalEventProps {
  /** 터미널 데이터 입력 이벤트 핸들러 */
  onData?: (arg: string) => void;
  /** 터미널의 X 좌표 (수직 분할에서의 위치) */
  x: number;
  /** 터미널의 Y 좌표 (수평 분할에서의 위치) */
  y: number;
  /** 단독 터미널 여부 (전체 터미널이 1개인 경우) */
  isSingle: boolean;
  /** 현재 포커스된 터미널인지 여부 */
  isFocus?: boolean;

  /** 수직 분할 추가 아이콘 표시 여부 */
  isShowAddVertical: boolean;
  /** 수평 분할 추가 아이콘 표시 여부 */
  isShowAddHorizon: boolean;
  /** 워크스페이스 ID */
  workspaceId: string;
  /** 워크로드 ID */
  workloadId: string;
  /** 워크로드 타입 */
  workloadType: string;
}

/**
 * TerminalNode 컴포넌트
 *
 * 개별 터미널 노드를 렌더링하고 관리합니다. xterm.js를 사용하여 실제 터미널을 구현하고,
 * Web Worker를 통해 WebSocket 연결을 관리합니다. 터미널 분할, 크기 조정, 테마 변경 등의
 * 기능을 제공합니다.
 *
 * @param props - TerminalNodeProps 객체
 */
export function WorkloadTerminalNode({
  x,
  y,
  isSingle,
  isFocus,
  onFocus,
  onDelete,
  onSplitVertical,
  onSplitHorizon,
  isShowAddVertical,
  isShowAddHorizon,
  workspaceId,
  workloadId,
  workloadType,
}: WorkloadTerminalNodeProps) {
  // xterm.js 터미널 인스턴스
  const term = useRef<XTerminal | null>(null);
  // 터미널 DOM 요소 참조
  const termRef = useRef<HTMLDivElement>(null);
  // 컨테이너 DOM 요소 참조
  const containerRef = useRef<HTMLDivElement>(null);
  // 터미널 크기 자동 조정을 위한 FitAddon
  const fitAddon = useRef<FitAddon>(new FitAddon());
  // WebSocket 연결을 관리하는 Web Worker
  const worker = useRef<Worker | null>(null);
  // 연결 상태 추적
  const connect = useRef(false);

  // fitAddon으로 자동 조정되는 터미널 크기
  const columns = useRef(120);
  const rows = useRef(30);

  // 현재 선택된 터미널 테마
  const resultTheme = useAtomValue(terminalThemeAtom);

  /**
   * 터미널 클릭 이벤트 핸들러
   * 터미널을 클릭했을 때 포커스를 설정하고 스크롤을 맨 아래로 이동
   */
  const handleClickTerminal = () => {
    if (typeof x === "number" && typeof y === "number") {
      onFocus?.(x, y);
    }
    term.current?.focus();
    term.current?.scrollToBottom();
  };

  /**
   * 최초 진입 시 터미널 설정 및 초기화
   * xterm.js 터미널을 생성하고 기본 설정을 적용
   */
  useEffect(() => {
    // xterm.js 터미널 인스턴스 생성
    const terminal = new XTerminal({
      theme: Arthur, // 기본 테마
      cursorStyle: "underline", // 커서 스타일
      cursorBlink: true, // 커서 깜빡임
      fontSize: 14, // 폰트 크기
      // columns와 rows를 고정값으로 설정하고 fitAddon으로 자동 조정
      cols: 120, // 충분히 큰 값으로 설정
      rows: 30, // 충분히 큰 값으로 설정
      allowTransparency: true, // 투명도 허용
      scrollback: 1000, // 스크롤백 버퍼 크기
    });

    if (termRef.current && !term.current) {
      // FitAddon을 터미널에 로드
      terminal.loadAddon(fitAddon.current);
      // 터미널을 DOM에 마운트
      terminal.open(termRef.current);

      // fitAddon을 사용하여 컨테이너에 맞춤 (약간의 지연 후 실행)
      setTimeout(() => {
        try {
          fitAddon.current.fit();

          // 초기 크기를 가져와서 worker에 전달
          const dimensions = fitAddon.current.proposeDimensions();
          if (dimensions) {
            columns.current = dimensions.cols;
            rows.current = dimensions.rows;
          }
        } catch (error) {
          console.warn("Initial FitAddon fit failed:", error);
        }
      }, 200);

      // ** onKey EVENT : 키를 눌렀을때 발생하는 이벤트
      terminal.onKey(({ key, domEvent }) => {
        if (terminal) {
          if (domEvent.type === "keydown" && key === "\x04") {
            console.log(" key down `\x04` : ");
          }
        }
      });

      // ** onData EVENT : 터미널에 타이핑을하거나 붙여넣기할 경우 발생하는 이벤트 처리.
      terminal.onData((data) => {
        // 타이핑 or 붙여넣기한 것을 웹 소켓 통신으로 보냄
        worker.current?.postMessage({
          type: "COMMAND",
          payload: {
            command: data,
          },
        });
      });

      // 윈도우 붙여넣기 (Ctrl+V) 처리
      terminal.attachCustomKeyEventHandler((arg) => {
        if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
          navigator.clipboard.readText().then((text) => {
            terminal.write(text);
          });
        }

        return true;
      });

      // 터미널 인스턴스 저장
      term.current = terminal;
    }

    // 연결 해제 작업 (cleanup 함수)
    return () => {
      // 터미널 해제
      if (terminal) {
        terminal.dispose();
      }

      term.current?.dispose();
      // 소켓 해제
      worker.current?.postMessage({
        type: "DISCONNECT",
      });

      connect.current = false;
    };
  }, []);

  /**
   * 터미널 로드 시 WebSocket 연결 설정
   * Web Worker를 통해 WebSocket 연결을 관리하고 터미널 통신을 처리
   */
  useEffect(() => {
    // worker 작동 여부로 여러 connect 방지
    if (term.current && !worker.current) {
      // Web Worker 초기화
      worker.current = new Worker(
        new URL("@/utils/workload/terminal-worker.ts", import.meta.url),
      );

      let isSSL: boolean;
      let url: string;

      /* ==== 1. 로컬 환경시 사용  */
      if (process.env.NODE_ENV === "development") {
        isSSL = process.env.NEXT_PUBLIC_WEBSOCKET_HOST?.indexOf("https") !== -1;
        url = `${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/ws/workload/terminal`
          .replace(/https?:\/\//, "")
          .split("/")
          .filter(Boolean)
          .join("/");
      } else {
        /* ==== 2. 배포된 환경시 사용 ==== */
        isSSL = window.location.protocol === "https:";
        url = `${window.location.host}/ws/workload/terminal`;
      }

      // Web Worker에서 오는 메시지 처리
      worker.current.onmessage = ({ data }: MessageEvent) => {
        const { type, payload } = data;

        if (type === "INIT") {
          // 연결 초기화 완료
          connect.current = true;
        } else if (type === "PRINT") {
          // 터미널에 출력 데이터 표시
          term.current?.write(payload);
        } else if (type === "DISCONNECTED") {
          // 연결 해제 시 재연결 시도 메시지 표시
          term.current?.write(
            "\n\rDisconnected from \x1B[1;3;31mServer\x1B[0m. Attempting to reconnect...\n\r",
          );

          if (connect.current) {
            console.log("👀 RECONNECT WEBSOCKET (onclose) : ", connect.current);
            // 재연결 시도
            worker.current?.postMessage({
              type: "CONNECT",
              payload: {
                url: `${isSSL ? "wss://" : "ws://"}${url}`,
                workspaceId: workspaceId,
                workloadId: workloadId,
                workloadType: workloadType,
              },
            });
          }
        } else if (type === "ERROR") {
          // 에러 발생 시 메시지 표시
          term.current?.write(`${c.cyan("에러가 발생했습니다.")}\r\n`);
        }
      };

      // WebSocket 연결 시작
      worker.current.postMessage({
        type: "CONNECT",
        payload: {
          url: `${isSSL ? "wss://" : "ws://"}${url}`,
          workspaceId: workspaceId,
          workloadId: workloadId,
          workloadType: workloadType,
        },
      });
    }
  }, [workspaceId, workloadId, workloadType]);

  /**
   * 테마 변경 시 터미널 테마 업데이트
   */
  useEffect(() => {
    if (term.current && resultTheme) {
      term.current.options.theme = TERMINAL_THEME_LIST[resultTheme];
    }
  }, [resultTheme]);

  /**
   * 포커싱 시 스크롤을 맨 아래로 이동
   */
  useEffect(() => {
    if (isFocus) {
      term.current?.scrollToBottom();
    }
  }, [isFocus]);

  /**
   * 컨테이너 크기 변화 시 fitAddon으로 자동 조정
   * ResizeObserver를 사용하여 컨테이너 크기 변화를 감지하고 터미널 크기를 자동으로 조정
   */
  useEffect(() => {
    if (term.current && containerRef.current) {
      // ResizeObserver를 사용하여 컨테이너 크기 변화 감지
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (
            entry.target === containerRef.current &&
            term.current &&
            fitAddon.current
          ) {
            // 디바운스된 fit 실행 (100ms 지연)
            setTimeout(() => {
              try {
                fitAddon.current.fit();

                // fit 후 실제 크기를 가져와서 worker에 전달
                const dimensions = fitAddon.current.proposeDimensions();
                if (dimensions) {
                  columns.current = dimensions.cols;
                  rows.current = dimensions.rows;

                  // Web Worker에 크기 변경 알림
                  worker.current?.postMessage({
                    type: "RESIZE",
                    payload: {
                      columns: columns.current,
                      rows: rows.current,
                    },
                  });
                }
              } catch (error) {
                console.warn("FitAddon fit failed:", error);
              }
            }, 100);
          }
        }
      });

      // 컨테이너 관찰 시작
      resizeObserver.observe(containerRef.current);

      // cleanup: ResizeObserver 해제
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <Container
      ref={containerRef}
      onClick={handleClickTerminal}
      id={`pane${x}-term${y}`}
    >
      {/* 포커스되지 않은 터미널에 마스크 오버레이 표시 */}
      {!isFocus && <Mask />}

      {/* 터미널 헤더 - 분할 버튼과 삭제 버튼 포함 */}
      <Header className={resultTheme}>
        <HeaderButtonWrapper>
          {/* 수평 분할 버튼 */}
          {isShowAddHorizon && (
            <HeaderButton
              type="button"
              onClick={onSplitHorizon}
              className="horizontally"
            >
              <MyIcon name="SplitDown" color="var(--icon-fill)" />
            </HeaderButton>
          )}
          {/* 수직 분할 버튼 */}
          {isShowAddVertical && (
            <HeaderButton type="button" onClick={onSplitVertical}>
              <MyIcon name="SplitRight" color="var(--icon-fill)" />
            </HeaderButton>
          )}
        </HeaderButtonWrapper>

        {/* 터미널 삭제 버튼 (단독 터미널이 아닌 경우에만 표시) */}
        <div>
          {!isSingle && (
            <button type="button" onClick={(evt) => onDelete?.(evt, x, y)}>
              <MyIcon name="Close" color="var(--icon-fill)" />
            </button>
          )}
        </div>
      </Header>

      {/* 터미널 메인 영역 */}
      <Main ref={termRef} className={resultTheme} />
    </Container>
  );
}

/**
 * TerminalNode 컴포넌트의 스타일드 컴포넌트들
 */

/**
 * 터미널 노드의 메인 컨테이너
 * flexbox를 사용하여 헤더와 메인 영역을 세로로 배치
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  letter-spacing: normal;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

/**
 * 포커스되지 않은 터미널에 표시되는 마스크 오버레이
 * 반투명 검은색 배경으로 포커스 상태를 시각적으로 구분
 */
const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

/**
 * 터미널 헤더
 * 분할 버튼과 삭제 버튼을 포함하며, 테마에 따른 스타일 적용
 */
const Header = styled.div`
  background-color: #283237;
  height: 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  position: relative;
  height: 28px;
  padding: 0 10px;

  &.allow-resize {
    cursor: ns-resize;
  }

  --icon-fill: #fff;

  ${createTermFgClasses()}
`;

/**
 * 헤더 버튼들을 감싸는 컨테이너
 * 분할 버튼들을 오른쪽 정렬로 배치
 */
const HeaderButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

/**
 * 헤더 버튼 스타일
 * 분할 및 삭제 버튼의 공통 스타일 정의
 */
const HeaderButton = styled.button`
  background-color: inherit;
  color: var(--gray04);
  border: none;
  font-size: var(--fs-1);
  line-height: var(--lh-1);
  cursor: pointer;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * 터미널 메인 영역
 * xterm.js 터미널이 렌더링되는 영역으로, 스크롤바 스타일과 테마 적용
 */
const Main = styled.div`
  position: relative;
  background-color: #1c1c1c;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;

  &.log .xterm-screen {
    padding: 1rem;
    height: 500px !important;
  }

  .xterm-screen {
    transition: all 0.3s ease;
  }

  .xterm-viewport {
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      min-height: 20px;
      background-color: #9a9ba0;
      border-radius: 20px;
      border-color: #8d8e94;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  /* xterm.js가 컨테이너에 맞춰지도록 설정 */
  .xterm {
    width: 100% !important;
    height: 100% !important;
  }

  ${createTermBgClasses()}
`;
