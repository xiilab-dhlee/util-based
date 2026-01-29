"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { CreateWorkloadHubImageSelect } from "@/domain/workload/components/create/create-workload-hub-image-select";
import { CreateWorkloadImageButton } from "@/domain/workload/components/create/create-workload-image-button";
import { CreateWorkloadRegistryImageSelect } from "@/domain/workload/components/create/create-workload-registry-image-select";
import { WORKLOAD_IMAGE_TYPES } from "@/domain/workload/constants/workload.constant";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import {
  canUseHubImageAtom,
  harborImageNameAtom,
  imageTagNameAtom,
  imageTypeAtom,
} from "@/domain/workload/state/create-workload.atom";
import type { WorkloadImageType } from "@/domain/workload/types/workload.type";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { WorkloadImageTooltipTitle } from "@/shared/components/tooltip-title/workload-image-tooltip-title";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { errorTextStyle } from "@/styles/mixins/text";

export function CreateWorkloadImage() {
  const canUseHubImage = useAtomValue(canUseHubImageAtom);
  const [imageType, setImageType] = useAtom(imageTypeAtom);
  const setHarborImageName = useSetAtom(harborImageNameAtom);
  const setImageTagName = useSetAtom(imageTagNameAtom);
  const { control } = useFormContext<CreateWorkloadFormValues>();
  const { field: imageTypeField, fieldState: imageTypeFieldState } =
    useController({
      name: "imageType",
      control,
    });
  const { field: harborImageNameField, fieldState: harborImageNameFieldState } =
    useController({
      name: "harborImageName",
      control,
    });
  const { field: imageTagNameField, fieldState: imageTagNameFieldState } =
    useController({
      name: "imageTagName",
      control,
    });
  const imageErrorMessage =
    imageTypeFieldState.error?.message ??
    harborImageNameFieldState.error?.message ??
    imageTagNameFieldState.error?.message;

  const handleImageNameChange = (value: string) => {
    harborImageNameField.onChange(value);
  };

  const handleImageTagChange = (value: string) => {
    imageTagNameField.onChange(value);
  };

  const resetImageSelection = () => {
    harborImageNameField.onChange("");
    imageTagNameField.onChange("");
    setHarborImageName("");
    setImageTagName("");
  };

  const handleImageTypeChange = (nextType: WorkloadImageType) => {
    if (nextType === imageType) {
      return;
    }
    imageTypeField.onChange(nextType);
    setImageType(nextType);
    resetImageSelection();
  };

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          이미지
        </CreateWorkloadSectionTitle>
        <GuideTooltip title={<WorkloadImageTooltipTitle />} />
      </Header>
      <ImageButtonGroup>
        {canUseHubImage && (
          <CreateWorkloadImageButton
            type={WORKLOAD_IMAGE_TYPES.HUB}
            setType={handleImageTypeChange}
            isSelected={imageType === WORKLOAD_IMAGE_TYPES.HUB}
          />
        )}
        <CreateWorkloadImageButton
          type={WORKLOAD_IMAGE_TYPES.BUILT_IN}
          setType={handleImageTypeChange}
          isSelected={imageType === WORKLOAD_IMAGE_TYPES.BUILT_IN}
        />
        <CreateWorkloadImageButton
          type={WORKLOAD_IMAGE_TYPES.PRIVATE}
          setType={handleImageTypeChange}
          isSelected={imageType === WORKLOAD_IMAGE_TYPES.PRIVATE}
        />
        <CreateWorkloadImageButton
          type={WORKLOAD_IMAGE_TYPES.PUBLIC}
          setType={handleImageTypeChange}
          isSelected={imageType === WORKLOAD_IMAGE_TYPES.PUBLIC}
        />
      </ImageButtonGroup>
      <ImageSelectionContainer>
        {imageType === WORKLOAD_IMAGE_TYPES.HUB && (
          <CreateWorkloadHubImageSelect
            onHarborImageNameChange={handleImageNameChange}
            onImageTagNameChange={handleImageTagChange}
          />
        )}
        {imageType === WORKLOAD_IMAGE_TYPES.BUILT_IN && (
          <span>준비 중입니다.</span>
        )}
        {(imageType === WORKLOAD_IMAGE_TYPES.PRIVATE ||
          imageType === WORKLOAD_IMAGE_TYPES.PUBLIC) && (
          <CreateWorkloadRegistryImageSelect
            registryType={imageType}
            harborImageNameValue={harborImageNameField.value ?? ""}
            imageTagNameValue={imageTagNameField.value ?? ""}
            onHarborImageNameChange={handleImageNameChange}
            onImageTagNameChange={handleImageTagChange}
          />
        )}
      </ImageSelectionContainer>
      {imageErrorMessage && <ErrorMessage>{imageErrorMessage}</ErrorMessage>}
    </Container>
  );
}

// 메인 컨테이너들
const Container = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const ImageSelectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const ImageButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ErrorMessage = styled.div`
  ${errorTextStyle}
  margin-top: 6px;
`;
