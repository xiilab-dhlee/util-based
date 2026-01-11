import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface AxiosServiceConfig {
  isAuth?: boolean;
}

/**
 * 세션 제공자 타입
 * 외부에서 세션을 주입받기 위한 콜백 함수
 * Session 타입은 src/shared/types/next-auth.d.ts에서 확장됨
 */
type SessionProvider = () => Session | null;

/** 테스트 환경 여부 */
const isTestAuth = process.env.TEST_AUTH_ENABLE === "true";

export class AxiosService {
  private static instance: AxiosService;
  private axios: AxiosInstance;
  private isAuth: boolean;
  private requestInterceptorId?: number;
  private responseInterceptorId?: number;

  // 외부에서 주입받은 세션 제공자
  private sessionProvider: SessionProvider | null = null;

  // 401 리다이렉트 중복 방지 플래그
  private static isRedirecting = false;

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
   * 현재 세션을 가져옵니다.
   * 외부에서 주입된 세션 제공자를 통해 동기적으로 세션을 반환합니다.
   */
  private getSession(): Session | null {
    if (this.sessionProvider) {
      return this.sessionProvider();
    }
    return null;
  }

  private setupInterceptors(): void {
    // 기존 인터셉터 제거
    if (this.requestInterceptorId !== undefined) {
      this.axios.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== undefined) {
      this.axios.interceptors.response.eject(this.responseInterceptorId);
    }

    // 요청 인터셉터 설정
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
      (error) => {
        console.log("Request interceptor error:", error);
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터 설정
    this.responseInterceptorId = this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: unknown) => {
        const { response } = error as { response?: { status: number } };

        if (response?.status === 401 && this.isAuth) {
          // 테스트 환경에서는 리다이렉트 스킵 (auth-provider에서 처리)
          if (isTestAuth) {
            return Promise.reject(error);
          }

          // 중복 리다이렉트 방지
          if (AxiosService.isRedirecting) {
            return Promise.reject(error);
          }

          // 클라이언트 사이드에서만 리다이렉트 실행
          if (typeof window !== "undefined") {
            AxiosService.isRedirecting = true;
            console.warn("Unauthorized request - signing out");

            // NextAuth signOut 사용 (React 상태 유지, 세션 정리)
            const callbackUrl = window.location.pathname;
            void signOut({
              callbackUrl: `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
            });
          }
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
