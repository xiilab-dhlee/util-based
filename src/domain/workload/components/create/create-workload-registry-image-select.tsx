"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { RegistryImageDropdown } from "@/domain/workload/components/create/registry-image-dropdown";
import { RegistryImageTagDropdown } from "@/domain/workload/components/create/registry-image-tag-dropdown";
import {
  harborImageNameAtom,
  imageTagNameAtom,
} from "@/domain/workload/state/create-workload.atom";

interface CreateWorkloadRegistryImageSelectProps {
  registryType: "PRIVATE" | "PUBLIC";
  harborImageNameValue: string;
  imageTagNameValue: string;
  onHarborImageNameChange: (value: string) => void;
  onImageTagNameChange: (value: string) => void;
}

export function CreateWorkloadRegistryImageSelect({
  registryType,
  harborImageNameValue,
  imageTagNameValue,
  onHarborImageNameChange,
  onImageTagNameChange,
}: CreateWorkloadRegistryImageSelectProps) {
  const [harborImageName, setHarborImageName] = useAtom(harborImageNameAtom);
  const [imageTagName, setImageTagName] = useAtom(imageTagNameAtom);
  const toNullable = (value: string | null | undefined) =>
    value === "" ? null : (value ?? null);

  // Cascade 로직: 이미지 변경 시 태그 초기화
  const handleImageChange = (value: string | null) => {
    const nextValue = value || "";
    onHarborImageNameChange(nextValue);
    setHarborImageName(nextValue);
    onImageTagNameChange("");
    setImageTagName(""); // Clear tag when image changes
  };

  const handleTagChange = (value: string | null) => {
    const nextValue = value || "";
    onImageTagNameChange(nextValue);
    setImageTagName(nextValue);
  };

  return (
    <Container>
      <DropdownRow>
        <RegistryImageDropdown
          registryType={registryType}
          value={toNullable(harborImageNameValue ?? harborImageName)}
          onChange={handleImageChange}
        />
        <RegistryImageTagDropdown
          registryType={registryType}
          harborImageName={toNullable(harborImageNameValue ?? harborImageName)}
          value={toNullable(imageTagNameValue ?? imageTagName)}
          onChange={handleTagChange}
        />
      </DropdownRow>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const DropdownRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;

  > * {
    min-width: 0;
  }
`;
