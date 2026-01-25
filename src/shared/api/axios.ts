import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import type { Session } from "next-auth";

interface AxiosServiceConfig {
  isAuth?: boolean;
}

const isDev = process.env.NODE_ENV === "development";

/** 개발 환경 전용 디버깅 로그 */
function axiosDebug(message: string, data?: Record<string, unknown>): void {
  if (!isDev) return;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  console.debug(`[AxiosService]${dataStr} ${message}`);
}

/** 세션 제공자 타입 - 현재 세션을 동기적으로 반환 */
type SessionProvider = () => Session | null;

/** 세션 갱신자 타입 - NextAuth의 update() 함수 */
type SessionUpdater = () => Promise<Session | null>;

/** 로그아웃 핸들러 타입 - 세션 무효화 및 로그아웃 처리 */
type LogoutHandler = () => Promise<void>;

/** 재시도 플래그를 위한 확장 타입 */
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Axios 서비스
 *
 * - 세션 기반 인증 토큰 자동 주입
 * - 401 등 인증 에러는 auth-provider에서 처리 (NextAuth 세션 에러 감지)
 */
export class AxiosService {
  private static instance: AxiosService;
  private axios: AxiosInstance;
  private isAuth: boolean;
  private requestInterceptorId?: number;
  private responseInterceptorId?: number;

  // 외부에서 주입받은 세션 제공자, 갱신자 및 로그아웃 핸들러
  private sessionProvider: SessionProvider | null = null;
  private sessionUpdater: SessionUpdater | null = null;
  private logoutHandler: LogoutHandler | null = null;

  // 로그아웃 처리 중인지 여부 (중복 호출 방지)
  private isLoggingOut = false;

  constructor(config: AxiosServiceConfig = {}) {
    this.axios = axios.create({
      headers: { "Content-Type": "application/json" },
    });
    this.isAuth = config.isAuth ?? true;
    this.setupInterceptors();
  }

  public static getInstance(config?: AxiosServiceConfig): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService(config);
    }
    return AxiosService.instance;
  }

  /**
   * 세션 제공자를 설정합니다.
   * AuthProvider에서 호출하여 세션을 동기적으로 제공합니다.
   */
  public setSessionProvider(provider: SessionProvider): void {
    this.sessionProvider = provider;
  }

  /**
   * 세션 제공자를 제거합니다.
   */
  public clearSessionProvider(): void {
    this.sessionProvider = null;
  }

  /**
   * 세션 갱신자를 설정합니다.
   * AuthProvider에서 NextAuth의 update() 함수를 주입합니다.
   */
  public setSessionUpdater(updater: SessionUpdater): void {
    this.sessionUpdater = updater;
  }

  /**
   * 세션 갱신자를 제거합니다.
   */
  public clearSessionUpdater(): void {
    this.sessionUpdater = null;
  }

  /**
   * 로그아웃 핸들러를 설정합니다.
   * AuthProvider에서 signOut 래퍼 함수를 주입합니다.
   */
  public setLogoutHandler(handler: LogoutHandler): void {
    this.logoutHandler = handler;
  }

  /**
   * 로그아웃 핸들러를 제거합니다.
   */
  public clearLogoutHandler(): void {
    this.logoutHandler = null;
  }

  /**
   * 현재 세션을 가져옵니다.
   * 외부에서 주입된 세션 제공자를 통해 동기적으로 세션을 반환합니다.
   */
  private getSession(): Session | null {
    if (this.sessionProvider) {
      return this.sessionProvider();
    }
    return null;
  }

  /**
   * 인증 실패 시 처리
   * - 로그아웃 핸들러가 있으면 호출 (next-auth 세션 무효화)
   * - 없으면 로그인 페이지로 직접 리다이렉트 (fallback)
   */
  private async handleAuthFailure(): Promise<void> {
    // 이미 로그아웃 처리 중이면 스킵 (중복 호출 방지)
    if (this.isLoggingOut) {
      axiosDebug("⏳ 이미 로그아웃 처리 중 → 스킵");
      return;
    }

    this.isLoggingOut = true;

    try {
      if (this.logoutHandler) {
        axiosDebug("🔒 세션 무효화 및 로그아웃 처리");
        await this.logoutHandler();
      } else {
        // fallback: 로그아웃 핸들러가 없으면 직접 리다이렉트
        axiosDebug("🔒 로그인 페이지로 리다이렉트 (fallback)");
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }
    } finally {
      // 리다이렉트 후 플래그 리셋 (페이지 이동 시 새로 초기화됨)
      this.isLoggingOut = false;
    }
  }

  private setupInterceptors(): void {
    // 기존 인터셉터 제거
    if (this.requestInterceptorId !== undefined) {
      this.axios.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== undefined) {
      this.axios.interceptors.response.eject(this.responseInterceptorId);
    }

    // 요청 인터셉터: 인증 토큰 자동 주입
    this.requestInterceptorId = this.axios.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && this.isAuth) {
          const session = this.getSession();

          if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // 응답 인터셉터: 401 에러 시 토큰 갱신 후 재시도
    this.responseInterceptorId = this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as RetryableAxiosRequestConfig;
        const requestUrl = originalRequest?.url || "unknown";

        // 401 에러 + 재시도 안 한 경우 + 세션 갱신자가 있는 경우
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.sessionUpdater
        ) {
          originalRequest._retry = true;
          axiosDebug("⏰ 401 에러 감지 → 토큰 갱신 시도", { url: requestUrl });

          try {
            // NextAuth 세션 갱신 시도 (JWT 콜백에서 토큰 갱신)
            const newSession = await this.sessionUpdater();

            if (newSession?.accessToken && !newSession.error) {
              axiosDebug("✅ 토큰 갱신 성공 → 요청 재시도", {
                url: requestUrl,
              });
              // 새 토큰으로 원래 요청 재시도
              originalRequest.headers.Authorization = `Bearer ${newSession.accessToken}`;
              return this.axios(originalRequest);
            }

            axiosDebug("❌ 토큰 갱신 실패 (새 토큰 없음 또는 세션 에러)", {
              url: requestUrl,
              error: newSession?.error,
            });
          } catch (refreshError) {
            axiosDebug("❌ 토큰 갱신 실패 (예외 발생)", {
              url: requestUrl,
              error: String(refreshError),
            });
          }

          // 갱신 실패 → 세션 무효화 후 로그아웃
          await this.handleAuthFailure();
        }

        return Promise.reject(error);
      },
    );
  }

  public updateConfig(config: AxiosServiceConfig): void {
    this.isAuth = config.isAuth ?? this.isAuth;
    this.setupInterceptors();
  }

  public getAxios(): AxiosInstance {
    return this.axios;
  }
}
