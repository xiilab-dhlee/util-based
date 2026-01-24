"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SSE_RECONNECT_ATTEMPTS } from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type { SSEConnectionState } from "@/domain/system-monitoring/types/metrics.type";
import { getSSEErrorMessage } from "@/shared/constants/sse.constant";

export interface UseSSEConnectionParams<T> {
  /** SSE URL */
  url: string;
  /** 수신할 이벤트 이름 */
  eventName: string;
  /** 연결 활성화 여부 */
  enabled: boolean;
  /** 메시지 수신 콜백 */
  onMessage: (data: T) => void;
  /** 연결 성공 시 콜백 */
  onOpen?: () => void;
  /** 연결 종료 시 콜백 */
  onClose?: () => void;
  /** 재연결 최대 시도 횟수 (기본: SSE_RECONNECT_ATTEMPTS) */
  reconnectAttempts?: number;
}

export interface UseSSEConnectionReturn extends SSEConnectionState {
  /** 수동 재연결 트리거 */
  reconnect: () => void;
}

/**
 * SSE 연결 관리 훅
 *
 * SSE 연결의 생명주기를 관리합니다:
 * - 연결 상태 추적 (isConnected)
 * - 에러 처리 및 재연결
 * - AbortController를 통한 정리
 *
 * @example
 * const { isConnected, isError, error } = useSSEConnection({
 *   url: "https://api.example.com/sse",
 *   eventName: "system-metrics",
 *   enabled: true,
 *   onMessage: (data) => {
 *     // 메시지 처리
 *   },
 * });
 */
export function useSSEConnection<T>({
  url,
  eventName,
  enabled,
  onMessage,
  onOpen,
  onClose,
  reconnectAttempts = SSE_RECONNECT_ATTEMPTS,
}: UseSSEConnectionParams<T>): UseSSEConnectionReturn {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const prevUrlRef = useRef(url);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  // 현재 연결 파라미터를 ref로 관리
  const paramsRef = useRef({ url, eventName, reconnectAttempts });

  useEffect(() => {
    onMessageRef.current = onMessage;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  }, [onMessage, onOpen, onClose]);

  useEffect(() => {
    paramsRef.current = { url, eventName, reconnectAttempts };
  }, [url, eventName, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connectRef = useRef<() => Promise<void>>();

  connectRef.current = async () => {
    const {
      url: currentUrl,
      eventName: currentEventName,
      reconnectAttempts: currentReconnectAttempts,
    } = paramsRef.current;

    if (!session?.accessToken || !currentUrl) return;
    disconnect();

    abortControllerRef.current = new AbortController();

    try {
      await fetchEventSource(currentUrl, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        signal: abortControllerRef.current.signal,
        openWhenHidden: true,

        async onopen(response) {
          if (response.ok) {
            setIsConnected(true);
            setIsError(false);
            setError(null);
            reconnectAttemptsRef.current = 0;
            onOpenRef.current?.();
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        },

        onmessage(event) {
          if (event.event !== currentEventName) return;

          try {
            const data = JSON.parse(event.data) as T;
            onMessageRef.current(data);
          } catch (parseError) {
            console.error(
              `Failed to parse ${currentEventName} event:`,
              parseError,
            );
          }
        },

        onerror(err) {
          setIsConnected(false);
          if (reconnectAttemptsRef.current < currentReconnectAttempts) {
            reconnectAttemptsRef.current += 1;
          } else {
            setIsError(true);
            setError(
              getSSEErrorMessage(
                `SSE connection failed after ${currentReconnectAttempts} attempts`,
              ),
            );
            throw err;
          }
        },

        onclose() {
          setIsConnected(false);
          onCloseRef.current?.();
        },
      });
    } catch (connectionError) {
      if (
        connectionError instanceof Error &&
        connectionError.name === "AbortError"
      ) {
        return;
      }
      setIsError(true);
      setError(
        getSSEErrorMessage(
          `Failed to connect SSE: ${connectionError instanceof Error ? connectionError.message : String(connectionError)}`,
        ),
      );
    }
  };

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connectRef.current?.();
  }, []);

  useEffect(() => {
    if (prevUrlRef.current !== url) {
      reconnectAttemptsRef.current = 0;
      setIsError(false);
      setError(null);
      prevUrlRef.current = url;
    }
  }, [url]);

  useEffect(() => {
    if (!enabled || !session?.accessToken || !url) {
      disconnect();
      if (!enabled) {
        setIsError(false);
        setError(null);
      }
      return;
    }

    connectRef.current?.();

    return () => {
      disconnect();
    };
  }, [enabled, session?.accessToken, url, disconnect]);

  return {
    isConnected,
    isError,
    error,
    reconnect,
  };
}
