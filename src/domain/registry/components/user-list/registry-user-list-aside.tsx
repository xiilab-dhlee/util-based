"use client";

import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";

import { REGISTRY_USER_TAG_PAGE_SIZE } from "@/domain/registry/constants/registry-user-list.constant";
import { useGetRegistryUserTagsByAccountIdByMode } from "@/domain/registry/hooks/use-get-registry-user-tags-by-account-id-by-mode";
import {
  registryUserSelectedAccountIdAtom,
  registryUserTagPageAtom,
} from "@/domain/registry/state/registry-user-list.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { RegistryUserTagListBody } from "./registry-user-tag-list-body";

interface RegistryUserListAsideProps {
  mode: RegistryMode;
}

export function RegistryUserListAside({ mode }: RegistryUserListAsideProps) {
  const selectedAccountId = useAtomValue(registryUserSelectedAccountIdAtom);
  const [page, setPage] = useAtom(registryUserTagPageAtom);

  const { data, isLoading, isError } = useGetRegistryUserTagsByAccountIdByMode(
    mode,
    selectedAccountId,
    {
      request: {
        page: {
          pageNo: page - 1,
          pageSize: REGISTRY_USER_TAG_PAGE_SIZE,
        },
      },
    },
    {
      query: {
        enabled: !!selectedAccountId,
      },
    },
  );

  const handlePage = (page: number) => {
    setPage(page);
  };

  if (!selectedAccountId) {
    return (
      <StyledAsideDetailContainer>
        <MySearchFilter title="컨테이너 이미지 정보" total={data?.totalSize} />
        <EmptyState title="사용자를 선택해 주세요." />
      </StyledAsideDetailContainer>
    );
  }

  return (
    <StyledAsideDetailContainer>
      {/* 필터 영역 */}
      <MySearchFilter title="컨테이너 이미지 정보" total={data?.totalSize} />

      {/* 본문 영역 */}
      <RegistryUserTagListBody
        data={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
        mode={mode}
      />

      {/* 푸터 영역 */}
      <ListPageFooter
        total={data?.totalSize || 0}
        page={page}
        pageSize={REGISTRY_USER_TAG_PAGE_SIZE}
        onChange={handlePage}
        isLoading={isLoading}
      />
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 16px 24px 20px 24px;
`;
