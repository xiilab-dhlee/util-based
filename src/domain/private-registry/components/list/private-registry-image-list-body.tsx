"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import {
  privateRegistryImagePageAtom,
  privateRegistrySelectedItemAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { useGetAdminPrivateRegistryImages } from "@/domain/private-registry-image/hooks/use-get-admin-private-registry-images";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { PrivateRegistryImageCard } from "../../../private-registry-image/components/private-registry-image-card";

export function PrivateRegistryImageListBody() {
  const page = useAtomValue(privateRegistryImagePageAtom);
  const selectedItem = useAtomValue(privateRegistrySelectedItemAtom);

  const { data } = useGetAdminPrivateRegistryImages({
    page,
    size: 10,
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
  max-height: 690px;

  & > * {
    margin-bottom: 8px;
  }

  ${customScrollbar()}
`;
