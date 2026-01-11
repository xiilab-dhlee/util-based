import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { Session } from "next-auth";

// Extend NextAuth Session type to include custom properties
interface CustomSession extends Session {
  accessToken?: string;
  refresh_token?: string;
  error?: string;
  expires: string;
  roles?: string[];
}

interface AxiosServiceConfig {
  isAuth?: boolean;
}

/**
 * 세션 제공자 타입
 * 외부에서 세션을 주입받기 위한 콜백 함수
 */
type SessionProvider = () => CustomSession | null;

export class AxiosService {
  private static instance: AxiosService;
  private axios: AxiosInstance;
  private isAuth: boolean;
  private requestInterceptorId?: number;
  private responseInterceptorId?: number;

  // 외부에서 주입받은 세션 제공자
  private sessionProvider: SessionProvider | null = null;

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
  private getSession(): CustomSession | null {
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
          console.warn("Unauthorized request - redirecting to signin");

          // 클라이언트 사이드에서만 리다이렉트 실행
          if (typeof window !== "undefined") {
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `/signin?callbackUrl=${returnUrl}`;
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
