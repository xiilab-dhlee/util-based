"use client";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface PrivateRegistryTagFilterProps {
  totalSize?: number;
}

/**
 * 개인 레지스트리 태그 취약점 목록 페이지 상단 필터 컴포넌트
 *
 * 개인 레지스트리 태그 취약점 목록 페이지에서 검색어를 필터링하는 기능을 제공합니다.
 *
 * @returns 개인 레지스트리 태그 취약점 목록 페이지 상단 필터 컴포넌트
 */
export function PrivateRegistryTagFilter({
  totalSize,
}: PrivateRegistryTagFilterProps) {
  return <MySearchFilter title="취약점 목록" total={totalSize} />;
}
