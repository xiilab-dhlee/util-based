"use client";

import { useState } from "react";
import styled from "styled-components";
import { Input } from "xiilab-ui";

import { useGetAllCredentials } from "@/api/generated/admin-credential/admin-credential";
import type { AdminCredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createCredentialColumn } from "@/domain/credential/components/create-credential-column";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { CREDENTIAL_LIST_PAGE_SIZE } from "@/domain/system-setting/constants/system-setting.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { CustomizedTable } from "@/shared/components/table/customized-table";

const CREDENTIAL_BOX_HEIGHT = 542;

const columns = createCredentialColumn();

/**
 * 크리덴셜 목록 설정 컴포넌트
 * 검색, 테이블, 페이지네이션 포함
 */
export function CredentialListSetting() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isError, refetch } = useGetAllCredentials({
    pageNo: page - 1,
    pageSize: CREDENTIAL_LIST_PAGE_SIZE,
    keyword: searchText || undefined,
  });

  /**
   * 검색 핸들러
   * 검색 시 페이지를 0으로 리셋하고 검색어를 저장
   */
  const handleSearch = (value: string) => {
    setPage(1);
    setSearchText(value.trim());
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isError) {
    return (
      <SettingBox title="크리덴셜 목록" height={CREDENTIAL_BOX_HEIGHT}>
        <DataErrorState onRetry={refetch} />
      </SettingBox>
    );
  }

  return (
    <SettingBox
      title="크리덴셜 목록"
      height={CREDENTIAL_BOX_HEIGHT}
      extra={
        <SearchWrapper>
          <Input.Search
            name="search"
            placeholder="크리덴셜 이름 또는 생성자를 검색해 주세요."
            onSearch={handleSearch}
            autoComplete="off"
            width={290}
            height={30}
          />
        </SearchWrapper>
      }
    >
      <ContentWrapper>
        <TableWrapper>
          <CustomizedTable<AdminCredentialListItemResponse>
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            rowKey="credentialId"
            activePadding
            columnHeight={39}
          />
        </TableWrapper>

        <ListPageFooter
          total={data?.totalSize || 0}
          page={page}
          pageSize={CREDENTIAL_LIST_PAGE_SIZE}
          onChange={handlePageChange}
          isLoading={isLoading}
        />
      </ContentWrapper>
    </SettingBox>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1;
  width: 100%;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 290px;
`;

const TableWrapper = styled.div`
  height: 100%;
`;
