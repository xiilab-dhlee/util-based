"use client";

import { SETTING_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import { useGetSettingCredentials } from "@/domain/setting/hooks/use-get-setting-credentials";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { SettingCredentialCard } from "./setting-credential-card";

export function SettingCredentialListBody() {
  const { data, isLoading, isError } = useGetSettingCredentials({
    page: 1,
    size: SETTING_LIST_PAGE_SIZE,
    searchText: "",
  });

  if (isLoading) {
    return (
      <ListWrapper>
        <MySpinner />
      </ListWrapper>
    );
  }

  if (isError) {
    return (
      <ListWrapper>
        <EmptyState title="데이터를 불러오는 중 오류가 발생했습니다" />
      </ListWrapper>
    );
  }

  if (data?.content.length === 0) {
    return (
      <ListWrapper>
        <EmptyState />
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <GridList>
        {data?.content.map((credential) => (
          <SettingCredentialCard key={credential.id} {...credential} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
