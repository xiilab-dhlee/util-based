"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import {
  privateRegistryPageAtom,
  privateRegistrySelectedItemAtom,
} from "@/atoms/private-registry.atom";
import { sourcecodeSearchTextAtom } from "@/atoms/sourcecode.atom";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { privateRegistryListColumn } from "@/components/private-registry/list/private-registry-list-column";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPrivateRegistries } from "@/hooks/private-registry/use-get-private-registries";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { PrivateRegistryRow } from "./private-registry-row";

export function PrivateRegistryListBody() {
  const page = useAtomValue(privateRegistryPageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  const setSelectedItem = useSetAtom(privateRegistrySelectedItemAtom);

  const { data } = useGetPrivateRegistries({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 데이터 변경 시 첫 번째 레지스트리명 선택
  useEffect(() => {
    if (data?.content && data?.content?.length > 0) {
      setSelectedItem(data.content[0].name);
    }
  }, [data, setSelectedItem]);

  return (
    <ListWrapper>
      <CustomizedTable
        columns={privateRegistryListColumn}
        activePadding
        data={data?.content || []}
        customRow={PrivateRegistryRow}
      />
    </ListWrapper>
  );
}
