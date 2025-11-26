"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Tooltip } from "xiilab-ui";

import { WorkloadImageTooltipTitle } from "@/shared/components/tooltip-title/workload-image-tooltip-title";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { WORKLOAD_IMAGE_TYPES } from "../../constants/workload.constant";
import type { WorkloadImageType } from "../../schemas/workload.schema";
import { jobTypeAtom } from "../../state/create-workload.atom";
import { CreateWorkloadHubImageSelect } from "./create-workload-hub-image-select";
import { CreateWorkloadImageButton } from "./create-workload-image-button";
import { CreateWorkloadInternalRegistryImageSelect } from "./create-workload-internal-registry-image-select";
import { CreateWorkloadInternalRegistryImageTagSelect } from "./create-workload-internal-registry-image-tag-select";

export function CreateWorkloadImage() {
  const jobType = useAtomValue(jobTypeAtom);

  const [imageType, setImageType] = useState<WorkloadImageType>(
    WORKLOAD_IMAGE_TYPES[0],
  );

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          이미지
        </CreateWorkloadSectionTitle>
        <Tooltip maxWidth="540px" title={<WorkloadImageTooltipTitle />}>
          <IconWrapper>
            <Icon name="Tooltip" size={16} color="#5F6368" />
          </IconWrapper>
        </Tooltip>
      </Header>
      <ImageButtonGroup>
        <CreateWorkloadImageButton
          type="HUB"
          setType={setImageType}
          isSelected={imageType === "HUB"}
          disabled={jobType === "INTERACTIVE"}
        />
        <CreateWorkloadImageButton
          type="BUILTIN"
          setType={setImageType}
          isSelected={imageType === "BUILTIN"}
        />
        <CreateWorkloadImageButton
          type="INTERNAL_REGISTRY"
          setType={setImageType}
          isSelected={imageType === "INTERNAL_REGISTRY"}
        />
        <CreateWorkloadImageButton
          type="EXTERNAL_REGISTRY"
          setType={setImageType}
          isSelected={imageType === "EXTERNAL_REGISTRY"}
        />
      </ImageButtonGroup>
      <ImageSelectionContainer>
        {imageType === "HUB" && <CreateWorkloadHubImageSelect />}
        {imageType === "BUILTIN" && <span>준비 중입니다.</span>}
        {imageType === "INTERNAL_REGISTRY" && (
          <>
            <CreateWorkloadInternalRegistryImageSelect />
            <CreateWorkloadInternalRegistryImageTagSelect />
          </>
        )}
        {imageType === "EXTERNAL_REGISTRY" && <span>준비 중입니다.</span>}
        {/* <Dropdown
          options={imageOptions}
          placeholder="이미지를 선택해 주세요."
          value={imageId}
          onChange={handleChangeImage}
          width="100%"
        /> */}
        {/* Interactive Job + Private Registry + 보안 OFF: 이미지 경로 입력 */}
        {/* 그 외 Private Registry: 이미지+태그 드롭다운 */}
        {/* 나머지 타입: 이미지 드롭다운만 */}
        {/* {selectedImageType === "private" ? (
          jobType === JOB_TYPES.INTERACTIVE && !isSecurityEnabled ? (
            <Input
              placeholder="이미지 경로를 입력해 주세요"
              value={imagePathInput}
              onChange={(e) => setImagePathInput(e.target.value)}
              width="100%"
            />
          ) : (
            <ImageDropdownRow>
              <Dropdown
                placeholder="이미지를 선택해 주세요."
                options={imageOptions}
                value={selectedImage}
                onChange={setSelectedImage}
                width="100%"
              />
              <Dropdown
                placeholder="태그를 선택해 주세요."
                options={tagOptions}
                value={selectedTag}
                onChange={setSelectedTag}
                width="100%"
              />
            </ImageDropdownRow>
          )
        ) : (
          <Dropdown
            placeholder="이미지를 선택해 주세요."
            options={imageOptions}
            value={selectedImage}
            onChange={setSelectedImage}
            width="100%"
          />
        )} */}

        {/* 내부 레지스트리 선택 시 Private Image 영역 표시 */}
        {/* {selectedImageType === "private" && (
          <PrivateImageSection>
            <PrivateImageHeader>
              <PrivateImageLabel>
                <Typography.Text variant="body-2-2" color="#484848">
                  Private Image
                </Typography.Text>
              </PrivateImageLabel>
              <Switch
                checked={privateImageEnabled}
                onChange={setPrivateImageEnabled}
              />
              <CredentialCreateButton
                type="button"
                onClick={() => openCreateCredentialModal(true)}
              >
                <Icon name="PlusCircle" size={16} color="#666666" />
                <Typography.Text variant="body-2-4" color="#666666">
                  크레덴셜 생성
                </Typography.Text>
              </CredentialCreateButton>
            </PrivateImageHeader>

            <Dropdown
              placeholder="크레덴셜을 선택해 주세요"
              options={credentialOptions}
              value={selectedCredential}
              onChange={setSelectedCredential}
              width="100%"
            />
          </PrivateImageSection>
        )} */}
      </ImageSelectionContainer>
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
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

// const ImageDropdownRow = styled.div`
//   display: flex;
//   gap: 12px;
//   width: 100%;

//   > * {
//     flex: 1;
//   }
// `;

// const PrivateImageSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;

// const PrivateImageHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
// `;

// const PrivateImageLabel = styled.div`
//   display: flex;
//   align-items: center;
// `;

// const CredentialCreateButton = styled.button`
//   /* Reset button defaults */
//   appearance: none;
//   background: none;
//   border: none;
//   font: inherit;
//   margin: 0;

//   /* Component styles */
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   cursor: pointer;
//   margin-left: auto;
//   padding: 4px;

//   &:hover {
//     opacity: 0.8;
//   }

//   &:focus-visible {
//     outline: 2px solid #3d3fdf;
//     outline-offset: 2px;
//   }
// `;
