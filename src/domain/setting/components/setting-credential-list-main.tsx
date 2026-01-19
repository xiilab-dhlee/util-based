"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

import { useGetCredentials } from "@/api/generated/credential/credential";
import { CREDENTIAL_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SettingCredentialListBody } from "./setting-credential-list-body";
import { SettingCredentialListFilter } from "./setting-credential-list-filter";

/**
 * 설정 크리덴셜 목록 메인 컴포넌트
 *
 * 크리덴셜 목록 영역의 독립적인 콘텐츠 단위입니다.
 * (필터, 카드 목록, 페이지네이션)
 *
 * 조회 파라미터는 useState로 로컬 관리합니다.
 */
export function SettingCredentialListMain() {
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetCredentials(
    accountId,
    {
      pageNo: page - 1,
      pageSize: CREDENTIAL_LIST_PAGE_SIZE,
      keyword: "",
    },
    {
      query: {
        enabled: !!accountId,
      },
    },
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <SettingCredentialListFilter
        total={data?.totalSize ?? 0}
        loading={isLoading}
      />
      <SettingCredentialListBody
        content={data?.content ?? []}
        loading={isLoading}
        isError={isError}
      />
      <ListPageFooter
        total={data?.totalSize ?? 0}
        page={page}
        pageSize={CREDENTIAL_LIST_PAGE_SIZE}
        onChange={handlePageChange}
        isLoading={isLoading}
      />
    </>
  );
}
