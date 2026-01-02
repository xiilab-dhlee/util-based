"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import styled from "styled-components";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import { createCredentialColumn } from "@/domain/system-setting/components/create-credential-column";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { CREDENTIAL_LIST_PAGE_SIZE } from "@/domain/system-setting/constants/system-setting.constant";
import { useGetSystemCredentials } from "@/domain/system-setting/hooks/use-get-system-credentials";
import {
  credentialPageAtom,
  credentialSearchTextAtom,
} from "@/domain/system-setting/state/credential.atom";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { SearchInput } from "@/shared/components/input/search-input";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

const CREDENTIAL_BOX_HEIGHT = 542;

/**
 * 크리덴셜 목록 설정 컴포넌트
 * 검색, 테이블, 페이지네이션 포함
 */
export function CredentialListSetting() {
  const [page, setPage] = useAtom(credentialPageAtom);
  const searchText = useAtomValue(credentialSearchTextAtom);
  const setSearchText = useSetAtom(credentialSearchTextAtom);
  const publish = usePublish();

  const { data, isLoading, isError, refetch } = useGetSystemCredentials({
    page,
    size: CREDENTIAL_LIST_PAGE_SIZE,
    searchText,
  });

  /**
   * 검색 핸들러
   * 검색 시 페이지를 0으로 리셋하고 검색어를 저장
   */
  const handleSearch = (value: string) => {
    setPage(0);
    setSearchText(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = useCallback(
    (id: number) => {
      publish(SYSTEM_SETTING_EVENTS.openCredentialDeleteModal, { id });
    },
    [publish],
  );

  const handleNameClick = useCallback(
    (id: number) => {
      publish(SYSTEM_SETTING_EVENTS.openCredentialDetailModal, id);
    },
    [publish],
  );

  const columns = useMemo(() => {
    return createCredentialColumn(undefined, {
      onDelete: handleDelete,
      onNameClick: handleNameClick,
    });
  }, [handleDelete, handleNameClick]);

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
          <SearchInput
            placeholder="크리덴셜 이름 또는 생성자를 검색해 주세요."
            width="290px"
            onSearch={handleSearch}
          />
        </SearchWrapper>
      }
    >
      <ContentWrapper>
        <TableWrapper>
          <CustomizedTable<CredentialListType>
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            rowKey="id"
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
