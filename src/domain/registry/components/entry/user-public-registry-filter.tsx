"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Icon, Input } from "xiilab-ui";

import {
  userPublicRegistryPageAtom,
  userPublicRegistrySearchTextAtom,
} from "@/domain/registry/state/registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ROUTES } from "@/shared/constants/routes.constant";
import { moveButtonStyle } from "@/styles/mixins/button";

interface UserPublicRegistryFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function UserPublicRegistryFilter({
  totalSize,
  loading,
}: UserPublicRegistryFilterProps) {
  const router = useRouter();
  const setSearchText = useSetAtom(userPublicRegistrySearchTextAtom);
  const resetPage = useResetAtom(userPublicRegistryPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  const handleMove = () => {
    router.push(ROUTES.ADMIN_PUBLIC_REGISTRY);
  };

  return (
    <MySearchFilter title="사용자별 공유 레지스트리" total={totalSize}>
      <Input.Search
        name="search"
        placeholder="사용자 이름을 검색해 주세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
      />
      <MoveButton type="button" onClick={handleMove}>
        <Icon name="Front" color="#fafafa" size={16} />
        <span className="sr-only">사용자별 공유 레지스트리 페이지로 이동</span>
      </MoveButton>
    </MySearchFilter>
  );
}

const MoveButton = styled.button`
  ${moveButtonStyle}
`;
