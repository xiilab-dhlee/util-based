"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { ROUTES } from "@/shared/constants/routes.constant";
import { logoutBroadcast } from "@/shared/utils/logout-broadcast.util";

const isDev = process.env.NODE_ENV === "development";

function authDebug(message: string): void {
  if (isDev) {
    console.debug(`[LogoutSync] ${message}`);
  }
}

/**
 * 다중 탭 로그아웃 동기화 훅
 *
 * 기능:
 * 1. 다른 탭에서 로그아웃 시 감지하여 현재 탭도 로그인 페이지로 이동
 * 2. 중복 처리 방지
 *
 * @returns broadcastLogout - 로그아웃 시 다른 탭에 알리는 함수
 */
export function useLogoutSync(): {
  broadcastLogout: () => void;
} {
  const router = useRouter();
  const isHandlingLogout = useRef(false);

  // 다른 탭에서 로그아웃 메시지 수신 시 처리
  const handleLogoutMessage = useCallback(() => {
    if (isHandlingLogout.current) return;
    isHandlingLogout.current = true;

    authDebug("다른 탭에서 로그아웃 감지 → 로그인 페이지로 이동");

    // signOut 호출 없이 직접 리다이렉트
    // (이미 Keycloak 세션이 종료되었으므로 중복 호출 방지)
    router.push(ROUTES.AUTH_SIGNIN);

    // 상태 초기화를 위한 짧은 지연 후 플래그 해제
    setTimeout(() => {
      isHandlingLogout.current = false;
    }, 1000);
  }, [router]);

  // BroadcastChannel/localStorage 구독
  useEffect(() => {
    const unsubscribe = logoutBroadcast.subscribe(handleLogoutMessage);
    return unsubscribe;
  }, [handleLogoutMessage]);

  // 로그아웃 시 다른 탭에 알림
  const broadcastLogout = useCallback(() => {
    authDebug("로그아웃 브로드캐스트 전송");
    logoutBroadcast.broadcast();
  }, []);

  return { broadcastLogout };
}
