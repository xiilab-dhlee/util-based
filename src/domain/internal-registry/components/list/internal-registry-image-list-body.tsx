"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import {
  internalregistryImagePageAtom,
  internalregistrySelectedItemAtom,
} from "@/domain/internal-registry/state/internal-registry.atom";
import { useGetAdminInternalRegistryImages } from "@/domain/internal-registry-image/hooks/use-get-admin-internal-registry-images";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { InternalRegistryImageCard } from "./internal-registry-image-card";

export function InternalRegistryImageListBody() {
  const page = useAtomValue(internalregistryImagePageAtom);
  const selectedItem = useAtomValue(internalregistrySelectedItemAtom);

  const { data } = useGetAdminInternalRegistryImages({
    page,
    size: 10,
    registryName: selectedItem,
  });

  return (
    <Container>
      {data?.content?.map((item) => (
        <InternalRegistryImageCard key={item.id} {...item} />
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
