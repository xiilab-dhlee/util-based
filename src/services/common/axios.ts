import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { Session } from "next-auth";

// import { getSession } from "next-auth/react";

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

// 세션 캐시 인터페이스
interface SessionCache {
  session: CustomSession | null;
  timestamp: number;
  expiresAt: number;
}

export class AxiosService {
  private static instance: AxiosService;
  private axios: AxiosInstance;
  private isAuth: boolean;
  private requestInterceptorId?: number;
  private responseInterceptorId?: number;

  // 세션 캐시 관련 속성
  private sessionCache: SessionCache | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5분
  private readonly CACHE_BUFFER = 30 * 1000; // 30초 버퍼

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

  // 세션 캐시 관리 메서드
  private isCacheValid(): boolean {
    if (!this.sessionCache) return false;

    const now = Date.now();
    return now < this.sessionCache.expiresAt;
  }

  private async getCachedSession(): Promise<CustomSession | null> {
    // 캐시가 유효하면 캐시된 세션 반환
    if (this.isCacheValid()) {
      return this.sessionCache!.session;
    }

    // 캐시가 없거나 만료되었으면 새로 조회
    try {
      // const session = (await getSession()) as CustomSession | null;

      // 세션 정보 캐시
      this.sessionCache = {
        session: {
          accessToken: "test",
          refresh_token: "test",
          expires: "no expires",
          user: {
            id: "admin",
            name: "관리자",
            email: "admin@xiilab.com",
          },
          roles: ["ROLE_ADMIN"],
        },
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION - this.CACHE_BUFFER,
      };

      return this.sessionCache.session;
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  }

  // 캐시 무효화 메서드 (외부에서 호출 가능)
  public invalidateSessionCache(): void {
    this.sessionCache = null;
  }

  private async setupInterceptors(): Promise<void> {
    // 기존 인터셉터 제거
    if (this.requestInterceptorId !== undefined) {
      this.axios.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== undefined) {
      this.axios.interceptors.response.eject(this.responseInterceptorId);
    }

    // 요청 인터셉터 설정
    this.requestInterceptorId = this.axios.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"] && this.isAuth) {
          const session = await this.getCachedSession();

          if (session?.accessToken) {
            config.headers["Authorization"] = `Bearer ${session.accessToken}`;
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
      (response: AxiosResponse) => response,
      async (error: unknown) => {
        const { response } = error as { response?: { status: number } };
        const originalRequest = (
          error as {
            config: { sent?: boolean; headers: Record<string, string> };
          }
        ).config;

        if (response?.status === 401 && !originalRequest.sent && this.isAuth) {
          originalRequest.sent = true;

          // 401 에러 시 캐시 무효화하고 새 세션 조회
          this.invalidateSessionCache();

          try {
            const refreshedSession = await this.getCachedSession();
            if (refreshedSession?.accessToken) {
              originalRequest.headers["Authorization"] =
                `Bearer ${refreshedSession.accessToken}`;
              return this.axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
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

  // 디버깅용 메서드
  public getCacheInfo(): {
    hasCache: boolean;
    isValid: boolean;
    expiresAt?: number;
  } {
    return {
      hasCache: this.sessionCache !== null,
      isValid: this.isCacheValid(),
      expiresAt: this.sessionCache?.expiresAt,
    };
  }
}
