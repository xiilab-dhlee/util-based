"use client";

import { useState } from "react";

import { useGetSettingCredentials } from "@/domain/setting/hooks/use-get-setting-credentials";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SettingCredentialListBody } from "./setting-credential-list-body";
import { SettingCredentialListFilter } from "./setting-credential-list-filter";

const PAGE_SIZE = 10;

/**
 * 설정 크리덴셜 Article 컴포넌트
 *
 * 크리덴셜 목록 영역의 독립적인 콘텐츠 단위입니다.
 * (필터, 카드 목록, 페이지네이션)
 *
 * 조회 파라미터는 useState로 로컬 관리합니다.
 */
export function SettingCredentialArticle() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetSettingCredentials({
    page,
    size: PAGE_SIZE,
    searchText: "",
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <SettingCredentialListFilter
        total={data?.totalSize || 0}
        loading={isLoading}
      />
      <SettingCredentialListBody
        content={data?.content || []}
        loading={isLoading}
        isError={isError}
      />
      <ListPageFooter
        total={data?.totalSize || 0}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={handlePageChange}
        isLoading={isLoading}
      />
    </>
  );
}
