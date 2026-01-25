/**
 * 다중 탭 로그아웃 동기화를 위한 브로드캐스트 유틸리티
 *
 * BroadcastChannel API를 기본으로 사용하고,
 * 미지원 브라우저에서는 localStorage + storage 이벤트로 폴백합니다.
 */

type LogoutMessage = {
  type: "LOGOUT";
  timestamp: number;
};

type MessageHandler = (message: LogoutMessage) => void;

const CHANNEL_NAME = "auth-logout-channel";
const STORAGE_KEY = "auth-logout-event";

class LogoutBroadcast {
  private static instance: LogoutBroadcast | null = null;
  private channel: BroadcastChannel | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private useFallback = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): LogoutBroadcast {
    if (!LogoutBroadcast.instance) {
      LogoutBroadcast.instance = new LogoutBroadcast();
    }
    return LogoutBroadcast.instance;
  }

  private initialize(): void {
    // SSR 환경 체크
    if (typeof window === "undefined") return;

    // BroadcastChannel 지원 여부 확인
    if (typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<LogoutMessage>) => {
        this.notifyHandlers(event.data);
      };
    } else {
      // localStorage 폴백
      this.useFallback = true;
      window.addEventListener("storage", this.handleStorageEvent);
    }
  }

  private handleStorageEvent = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;

    try {
      const message = JSON.parse(event.newValue) as LogoutMessage;
      this.notifyHandlers(message);
    } catch {
      // 파싱 실패 무시
    }
  };

  private notifyHandlers(message: LogoutMessage): void {
    for (const handler of this.handlers) {
      handler(message);
    }
  }

  /**
   * 로그아웃 메시지를 다른 탭에 브로드캐스트
   */
  broadcast(): void {
    const message: LogoutMessage = {
      type: "LOGOUT",
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage(message);
    } else if (this.useFallback) {
      // localStorage 이벤트는 같은 탭에서 발생하지 않으므로
      // 값을 설정 후 즉시 삭제하여 다른 탭에만 알림
      // Safari private mode 등에서 localStorage 접근 시 예외 발생 가능
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // localStorage 접근 실패 시 무시 (로그아웃 흐름은 계속 진행)
      }
    }
  }

  /**
   * 로그아웃 메시지 수신 핸들러 등록
   * @returns 구독 해제 함수
   */
  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /**
   * 리소스 정리
   */
  destroy(): void {
    this.channel?.close();
    if (this.useFallback && typeof window !== "undefined") {
      window.removeEventListener("storage", this.handleStorageEvent);
    }
    this.handlers.clear();
    LogoutBroadcast.instance = null;
  }
}

/**
 * 로그아웃 브로드캐스트 API
 */
export const logoutBroadcast = {
  /**
   * 로그아웃 메시지를 다른 탭에 브로드캐스트
   */
  broadcast: () => {
    LogoutBroadcast.getInstance().broadcast();
  },

  /**
   * 로그아웃 메시지 수신 핸들러 등록
   * @returns 구독 해제 함수
   */
  subscribe: (handler: MessageHandler) => {
    return LogoutBroadcast.getInstance().subscribe(handler);
  },
};
