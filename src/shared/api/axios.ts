import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Session } from "next-auth";

interface AxiosServiceConfig {
  isAuth?: boolean;
}

/**
 * 세션 제공자 타입
 * 외부에서 세션을 주입받기 위한 콜백 함수
 * Session 타입은 src/shared/types/next-auth.d.ts에서 확장됨
 */
type SessionProvider = () => Session | null;

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
  }

  public updateConfig(config: AxiosServiceConfig): void {
    this.isAuth = config.isAuth ?? this.isAuth;
    this.setupInterceptors();
  }

  public getAxios(): AxiosInstance {
    return this.axios;
  }
}
