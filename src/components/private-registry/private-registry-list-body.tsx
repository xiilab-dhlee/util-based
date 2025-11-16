"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import {
  privateRegistryPageAtom,
  privateRegistrySelectedItemAtom,
} from "@/atoms/private-registry/private-registry.atom";
import { sourcecodeSearchTextAtom } from "@/atoms/sourcecode/sourcecode-list.atom";
import { privateRegistryListColumn } from "@/components/common/columns/private-registry-list-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import privateRegistryListConstants from "@/constants/registry/private-registry-list.constant";
import { useGetPrivateRegistries } from "@/hooks/private-registry/use-get-private-registries";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import PrivateRegistryRow from "./private-registry-row";

export function PrivateRegistryListBody() {
  const page = useAtomValue(privateRegistryPageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  const setSelectedItem = useSetAtom(privateRegistrySelectedItemAtom);

  const { data } = useGetPrivateRegistries({
    page,
    size: privateRegistryListConstants.pageSize,
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
