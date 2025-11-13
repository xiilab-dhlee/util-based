"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * 현재 활성 메뉴 키와 메뉴 클릭 핸들러를 제공하는 훅
 * @returns {Object} activeMenuKey와 handleMenuClick 함수
 */
export const useActiveMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 URL에서 activeMenuKey 추출 - useMemo로 메모이제이션
  const activeMenuKey = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // URL이 /mode/key 형태인 경우 key를 반환
    if (pathSegments.length >= 2) {
      return pathSegments[1]; // 두 번째 세그먼트가 key
    }

    return "";
  }, [pathname]);

  // 메뉴 클릭 핸들러 - useCallback으로 메모이제이션
  const onMenuClick = useCallback(
    (key: string) => {
      // 현재 경로에서 모드 추출
      const pathSegments = pathname.split("/").filter(Boolean);

      // 첫 번째 세그먼트가 모드 (standard 또는 admin)
      let currentMode = "standard"; // 기본값

      if (pathSegments.length > 0) {
        const firstSegment = pathSegments[0];
        if (firstSegment === "admin") {
          currentMode = firstSegment;
        }
      }

      // 새로운 경로 생성: /mode/key
      const path = `/${currentMode}/${key}`;
      router.push(path);
    },
    [router, pathname],
  );

  return {
    activeMenuKey,
    onMenuClick,
  };
};
