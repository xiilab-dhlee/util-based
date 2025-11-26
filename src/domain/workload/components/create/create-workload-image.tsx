"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

// import { CreateWorkloadImageTooltipTitle } from "@/shared/components/tooltip-title/create-workload-image-tooltip-title";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { jobTypeAtom } from "../../state/create-workload.atom";

export function CreateWorkloadImage() {
  const jobType = useAtomValue(jobTypeAtom);
  const [selectedImageType, setSelectedImageType] = useState("hub");

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          이미지
        </CreateWorkloadSectionTitle>
        <Icon
          name="Tooltip"
          size={16}
          color="#5F6368"
          className="tooltip-icon"
        />
      </Header>

      <ImageSelectionContainer>
        <ImageButtonGroup>
          {jobType !== "INTERACTIVE" && (
            <ImageButton
              type="button"
              $active={selectedImageType === "hub"}
              aria-pressed={selectedImageType === "hub"}
              onClick={() => setSelectedImageType("hub")}
            >
              <Icon name="Hub" size={16} active={selectedImageType === "hub"} />
              <Typography.Text
                variant="body-2-1"
                color={selectedImageType === "hub" ? "#154FED" : "#484848"}
              >
                허브
              </Typography.Text>
            </ImageButton>
          )}
          <ImageButton
            type="button"
            $active={selectedImageType === "builtin"}
            aria-pressed={selectedImageType === "builtin"}
            onClick={() => setSelectedImageType("builtin")}
          >
            <Icon
              name="BuiltInImage"
              size={16}
              active={selectedImageType === "builtin"}
            />
            <Typography.Text
              variant="body-2-1"
              color={selectedImageType === "builtin" ? "#000000" : "#484848"}
            >
              빌트인 이미지
            </Typography.Text>
          </ImageButton>
          <ImageButton
            type="button"
            $active={selectedImageType === "private"}
            aria-pressed={selectedImageType === "private"}
            onClick={() => setSelectedImageType("private")}
          >
            <Icon
              name="PrivateRegistry"
              size={16}
              active={selectedImageType === "private"}
            />
            <Typography.Text
              variant="body-2-1"
              color={selectedImageType === "private" ? "#000000" : "#484848"}
            >
              내부 레지스트리
            </Typography.Text>
          </ImageButton>
        </ImageButtonGroup>

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

const ImageSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const ImageButton = styled.button<{ $active?: boolean }>`
  /* Reset button defaults */
  appearance: none;
  background: none;
  border: none;
  font: inherit;
  margin: 0;

  /* Component styles */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: ${(props) => (props.$active ? "3px" : "2px")};
  border: 1px solid ${(props) => (props.$active ? "#3D3FDF" : "#B9BEC3")};
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 34px;
  flex: 1;
  white-space: nowrap;

  ${(props) =>
    props.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 4px;
      z-index: -1;
    }
  `}

  &:hover {
    border-color: #3d3fdf;
    background-color: rgba(54, 107, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #3d3fdf;
    outline-offset: 2px;
  }
`;

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
