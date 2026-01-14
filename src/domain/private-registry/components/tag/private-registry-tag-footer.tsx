"use client";

import { useAtom } from "jotai";

import { privateRegistryVulnerabilityPageAtom } from "@/domain/private-registry/state/private-registry-vulnerability.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface PrivateRegistryTagFooterProps {
  totalSize: number;
  isLoading: boolean;
}

/**
 * 개인 레지스트리 태그 취약점 목록 페이지 하단 푸터 컴포넌트
 *
 * 개인 레지스트리 태그 취약점 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 개인 레지스트리 태그 취약점 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 개인 레지스트리 태그 취약점 목록 페이지 하단 푸터 컴포넌트
 */
export function PrivateRegistryTagFooter({
  totalSize,
  isLoading,
}: PrivateRegistryTagFooterProps) {
  const [page, setPage] = useAtom(privateRegistryVulnerabilityPageAtom);

  // 페이지 변경 핸들러
  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
