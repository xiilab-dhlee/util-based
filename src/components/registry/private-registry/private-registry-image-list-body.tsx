"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import {
  privateRegistryImagePageAtom,
  privateRegistrySelectedItemAtom,
} from "@/atoms/registry/private-registry.atom";
import privateRegistryListConstants from "@/constants/registry/private-registry-list.constant";
import { useGetPrivateRegistryImages } from "@/hooks/registry/use-get-private-registry-images";
import PrivateRegistryImageCard from "./private-registry-image-card";

export function PrivateRegistryImageListBody() {
  const page = useAtomValue(privateRegistryImagePageAtom);
  const selectedItem = useAtomValue(privateRegistrySelectedItemAtom);

  const { data } = useGetPrivateRegistryImages({
    page,
    size: privateRegistryListConstants.imagePageSize,
    registryName: selectedItem,
  });

  return (
    <Container>
      {data?.content?.map((item) => (
        <PrivateRegistryImageCard key={item.id} {...item} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  height: 100%;

  & > * {
    margin-bottom: 8px;
  }
`;
