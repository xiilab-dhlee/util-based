"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { internalregistryListColumn } from "@/domain/internal-registry/components/list/internal-registry-list-column";
import { useGetInternalRegistries } from "@/domain/internal-registry/hooks/use-get-internal-registries";
import {
  internalregistryPageAtom,
  internalregistrySelectedItemAtom,
} from "@/domain/internal-registry/state/internal-registry.atom";
import { sourcecodeSearchTextAtom } from "@/domain/sourcecode/state/sourcecode.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { InternalRegistryRow } from "./internal-registry-row";

export function InternalRegistryListBody() {
  const page = useAtomValue(internalregistryPageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  const setSelectedItem = useSetAtom(internalregistrySelectedItemAtom);

  const { data } = useGetInternalRegistries({
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
        columns={internalregistryListColumn}
        activePadding
        data={data?.content || []}
        customRow={InternalRegistryRow}
      />
    </ListWrapper>
  );
}
