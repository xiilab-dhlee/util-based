"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  PAGE_META,
  type PageItemMeta,
  type PageKey,
} from "@/shared/constants/page-meta.constant";

/**
 * 현재 활성 메뉴 키와 메뉴 클릭 핸들러를 제공하는 훅
 * - activeMenuKey: 현재 URL에 가장 잘 매칭되는 PAGE_META key
 * - onMenuClick: 전달받은 key(PageKey)에 대응하는 href로 이동
 */
export const useActiveMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 URL에서 activeMenuKey 추출 - useMemo로 메모이제이션
  const activeMenuKey = useMemo(() => {
    const pageMetaEntries = Object.entries(PAGE_META) as [
      PageKey,
      PageItemMeta,
    ][];

    const entry = pageMetaEntries.find(([_pageKey, meta]) => {
      const href = meta.href;
      return typeof href === "string" && href === pathname;
    });

    if (!entry) {
      return "";
    }

    const [pageKey] = entry as [PageKey, unknown];
    return pageKey;
  }, [pathname]);

  // 메뉴 클릭 핸들러 - key를 PAGE_META key로 간주하고 href로 이동
  const onMenuClick = useCallback(
    (key: string) => {
      const pageKey = key as PageKey;
      const meta = PAGE_META[pageKey] as PageItemMeta | undefined;
      const href = meta?.href;

      // href가 문자열이 아닌 경우(동적 경로 함수 또는 없음)에는 네비게이션하지 않음
      if (typeof href !== "string") {
        return;
      }

      router.push(href);
    },
    [router],
  );

  return {
    activeMenuKey,
    onMenuClick,
  };
};
