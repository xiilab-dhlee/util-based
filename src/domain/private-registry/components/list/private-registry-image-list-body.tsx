"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import {
  RegistryImageTagFilterRequestOrder,
  RegistryImageTagFilterRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import {
  privateregistryImagePageAtom,
  privateregistrySelectedItemAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { PrivateRegistryImageCard } from "./private-registry-image-card";

export function PrivateRegistryImageListBody() {
  const page = useAtomValue(privateregistryImagePageAtom);
  const selectedItem = useAtomValue(privateregistrySelectedItemAtom);

  const { data } = useGetPrivateImageTagList(
    {
      pageRequest: {
        pageNo: page - 1,
        pageSize: 10,
      },
      filterRequest: {
        harborImageName: selectedItem,
        sort: RegistryImageTagFilterRequestSort.CREATED_AT,
        order: RegistryImageTagFilterRequestOrder.DESC,
      },
      workspaceFilter: {},
    },
    {
      query: {
        enabled: !!selectedItem,
      },
    },
  );

  return (
    <Container>
      {data?.data?.content?.map((item) => (
        <PrivateRegistryImageCard key={item.harborTagId} {...item} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 690px;

  & > * {
    margin-bottom: 8px;
  }

  ${customScrollbar()}
`;
