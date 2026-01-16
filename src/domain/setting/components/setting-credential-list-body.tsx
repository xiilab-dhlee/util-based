"use client";

import { SettingCredentialCard } from "@/domain/setting/components/setting-credential-card";
import { SETTING_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import { useGetSettingCredentials } from "@/domain/setting/hooks/use-get-setting-credentials";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";

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
        <EmptyState title={TABLE_MESSAGE.ERROR} />
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
