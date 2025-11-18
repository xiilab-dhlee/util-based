"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";
import { TabsSeparated } from "xiilab-ui";

import { MyIcon } from "@/components/common/icon";

/**
 * 탭 아이템의 아이콘을 Icon 컴포넌트로 매핑하는 함수
 *
 * 탭 배열의 각 아이템에서 문자열로 정의된 아이콘을 실제 Icon 컴포넌트로 변환합니다.
 * 중첩된 배열 구조도 지원하며, 아이콘이 문자열인 경우에만 변환을 수행합니다.
 *
 * @param tab - 변환할 탭 아이템 또는 탭 아이템 배열
 * @returns 아이콘이 Icon 컴포넌트로 변환된 탭 아이템
 */
const mapIconToComponent = (items: TabsSeparatedItem[]) => {
  return items.map((item) => {
    if (item.icon && typeof item.icon === "string") {
      return {
        ...item,
        icon: <MyIcon name={item.icon} />,
      };
    }
    return item;
  });
};

interface RouteTabProps {
  /** 표시할 탭 목록 */
  items: TabsSeparatedItem[];
}

interface StateTabProps {
  /** 표시할 탭 목록 */
  items: TabsSeparatedItem[];
  /** 선택된 탭 키 */
  selectedKey: string;
  /** 선택된 탭 키 설정 함수 */
  setSelectedKey: Dispatch<SetStateAction<string>>;
}

/**
 * RouteTab 컴포넌트
 *
 * 상세 페이지의 탭 네비게이션을 렌더링하는 컴포넌트입니다.
 * 현재 경로를 기반으로 활성 탭을 자동으로 감지하고,
 * 탭 클릭 시 해당 경로로 라우팅을 수행합니다.
 *
 */
export function RouteTab({ items }: RouteTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 탭 아이템의 아이콘을 Icon 컴포넌트로 변환
  const mappedTabs = mapIconToComponent(items);

  // 현재 경로를 기반으로 활성 탭 키를 찾음 (경로 끝부분과 일치하는 탭)
  const activeKey = items.findLast((item) => pathname.endsWith(item.key))?.key;

  const handleTabChange = (key: string) => {
    // 현재 searchParams를 URL에 추가
    const queryString = searchParams.toString();
    // 쿼리 문자열이 있으면 쿼리 문자열을 추가
    const queryPart = queryString ? `?${queryString}` : "";
    // 현재 pathname에서 기존 탭 키를 제거
    let cleanedPath = pathname;

    // 각 탭의 키를 순회하며 경로에서 제거
    for (const item of items) {
      // 탭 키가 없는 경우 건너뛰기
      if (!item.key) {
        continue;
      }

      // 경로에 탭 키가 포함되어 있으면 제거
      const tabPath = `/${item.key}`;
      if (cleanedPath.includes(tabPath)) {
        cleanedPath = cleanedPath.replace(tabPath, "");
      }
    }

    const nextPath = key ? `${cleanedPath}/${key}` : cleanedPath;
    const nextUrl = `${nextPath}${queryPart}`;
    // 현재 URL과 동일한 경우 라우팅하지 않음
    if (nextUrl === pathname + queryPart) {
      return;
    }

    router.push(`${nextPath}${queryPart}`);
  };

  return (
    <TabsSeparated
      items={mappedTabs}
      activeKey={activeKey || ""}
      onChange={handleTabChange}
    />
  );
}

/**
 * StateTab 컴포넌트
 *
 * 상태 기반 탭 네비게이션을 렌더링하는 컴포넌트입니다.
 * 외부에서 관리되는 상태를 기반으로 활성 탭을 표시하고,
 * 탭 클릭 시 상태 변경을 통해 탭 전환을 수행합니다.
 *
 */
export function StateTab({
  items,
  selectedKey,
  setSelectedKey,
}: StateTabProps) {
  // 탭 아이템의 아이콘을 Icon 컴포넌트로 변환
  const mappedTabs = mapIconToComponent(items);

  // 현재 선택된 탭 키를 활성 탭으로 설정
  const activeKey = selectedKey;

  const handleTabChange = (key: string) => {
    // 탭 키가 현재 선택된 탭 키와 같으면 상태 변경하지 않음
    if (key === selectedKey) {
      return;
    }

    // 새로운 탭 키로 상태 업데이트
    setSelectedKey(key);
  };

  return (
    <TabsSeparated
      items={mappedTabs}
      activeKey={activeKey || ""}
      onChange={handleTabChange}
    />
  );
}
