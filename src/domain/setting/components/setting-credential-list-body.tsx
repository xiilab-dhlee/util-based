"use client";

import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { SETTING_LIST_PAGE_SIZE } from "../constants/setting.constant";
import { useGetSettingCredentials } from "../hooks/use-get-setting-credentials";
import { SettingCredentialCard } from "./setting-credential-card";

export function SettingCredentialListBody() {
  const { data } = useGetSettingCredentials({
    page: 1,
    size: SETTING_LIST_PAGE_SIZE,
    searchText: "",
  });

  return (
    <ListWrapper>
      <GridList>
        {data?.content.length === 0 && (
          <ListEmpty
            title="허브가 없습니다."
            message="허브을 생성하여 사용해보세요."
          />
        )}
        {data?.content.map((credential) => (
          <SettingCredentialCard key={credential.id} {...credential} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
