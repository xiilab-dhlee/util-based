/**
 * 인증 관련 상수
 *
 * 테스트 사용자 정보를 중앙에서 관리합니다.
 * authOptions (서버)와 AxiosService (클라이언트) 모두에서 사용됩니다.
 */

export interface TestUser {
  id: string;
  name: string;
  email: string;
  preferred_username: string;
  roles: string[];
}

/**
 * 테스트용 사용자 목록
 */
export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    id: "1",
    name: "관리자",
    email: "admin@xiilab.com",
    preferred_username: "admin",
    roles: ["ROLE_ADMIN"],
  },
  user: {
    id: "2",
    name: "일반사용자",
    email: "user@xiilab.com",
    preferred_username: "user",
    roles: ["ROLE_USER"],
  },
};

/**
 * 기본 테스트 사용자 (개발 환경 fallback)
 */
export const DEFAULT_TEST_USER = TEST_USERS.admin;
