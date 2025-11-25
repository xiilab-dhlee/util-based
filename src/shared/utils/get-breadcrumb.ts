/**
 * Breadcrumb 아이템 생성 헬퍼 함수
 * - PAGE_META 기반 자동 breadcrumb 생성
 * - parent 체인 자동 순회
 * - 동적 파라미터 치환 지원
 */

import type { BreadcrumbItemType as AntdBreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";

import {
  PAGE_META,
  type PageItemMeta,
  type PageKey,
} from "@/shared/constants/page-meta.constant";

/**
 * href 정의(정적 문자열 or 동적 함수)를 실제 경로 문자열로 변환
 */
const resolveHref = (
  href: string | ((params: Record<string, string>) => string) | undefined,
  params: Record<string, string> | undefined,
): string | undefined => {
  if (!href) {
    return undefined;
  }

  if (typeof href === "function") {
    // 동적 경로: params가 없을 수도 있으므로 빈 객체로 대체
    return href((params ?? {}) as Record<string, string>);
  }

  return href;
};

/**
 * 앱 전역에서 사용하는 Breadcrumb 아이템 타입
 * - antd BreadcrumbItemType을 기반으로 하여 xiilab-ui Breadcrumb의 items와 완전히 호환
 * - PAGE_META에서 사용하는 iconName만 확장
 */
export type BreadcrumbItemType = AntdBreadcrumbItemType & {
  iconName?: string;
};

/**
 * PageKey와 params를 받아 breadcrumb 아이템 배열 생성
 *
 * @param pageKey - 현재 페이지 키 (예: "admin.node.detail")
 * @param params - 동적 경로 파라미터 (예: { name: "node-01" })
 * @returns BreadcrumbItemType 배열
 */
export const getBreadcrumbItems = (
  pageKey: PageKey,
  params?: Record<string, string>,
): BreadcrumbItemType[] => {
  const items: BreadcrumbItemType[] = [];
  const visited = new Set<PageKey>(); // parent 순환 참조 방어용

  let currentKey: PageKey | undefined = pageKey;

  // parent 체인을 따라가며 breadcrumb 아이템 수집
  while (currentKey) {
    if (visited.has(currentKey)) {
      // 순환 참조 방어
      console.error(
        `[getBreadcrumbItems] Circular reference detected: ${currentKey}`,
      );
      break;
    }
    visited.add(currentKey);

    const meta = PAGE_META[currentKey] as PageItemMeta;

    if (!meta) {
      // 정의되지 않은 PageKey에 대한 방어
      console.error(`[getBreadcrumbItems] Page meta not found: ${currentKey}`);
      break;
    }

    const href = resolveHref(meta.href, params);

    const item: BreadcrumbItemType = {
      title: meta.title,
      // iconName이 존재하는 경우에만 아이콘 이름을 설정
      iconName: meta.iconName,
      ...(href ? { href } : {}),
    };

    // 현재 아이템을 배열 앞쪽에 추가 (root가 가장 앞에 오도록)
    items.unshift(item);

    // 다음 parent로 이동
    currentKey = meta.parent;
  }

  return items;
};
