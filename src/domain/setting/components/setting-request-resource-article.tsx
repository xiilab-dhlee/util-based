"use client";

import { useState } from "react";

import { useGetSettingRequestResources } from "@/domain/setting/hooks/use-get-setting-request-resources";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SettingRequestResourceListBody } from "./setting-request-resource-list-body";
import { SettingRequestResourceListFilter } from "./setting-request-resource-list-filter";

const PAGE_SIZE = 9;

/**
 * 설정 리소스 요청 Article 컴포넌트
 *
 * 리소스 요청 목록 영역의 독립적인 콘텐츠 단위입니다.
 * (필터, 테이블, 페이지네이션)
 *
 * 조회 파라미터는 useState로 로컬 관리합니다.
 */
export function SettingRequestResourceArticle() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetSettingRequestResources({
    page,
    size: PAGE_SIZE,
    searchText: "",
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <SettingRequestResourceListFilter
        total={data?.totalSize || 0}
        loading={isLoading}
      />
      <SettingRequestResourceListBody
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
