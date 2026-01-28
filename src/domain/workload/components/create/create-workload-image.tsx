"use client";

import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";

import { CreateWorkloadHubImageSelect } from "@/domain/workload/components/create/create-workload-hub-image-select";
import { CreateWorkloadImageButton } from "@/domain/workload/components/create/create-workload-image-button";
import {
  imageTypeAtom,
  jobTypeAtom,
} from "@/domain/workload/state/create-workload.atom";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { WorkloadImageTooltipTitle } from "@/shared/components/tooltip-title/workload-image-tooltip-title";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

export function CreateWorkloadImage() {
  const jobType = useAtomValue(jobTypeAtom);

  const [imageType, setImageType] = useAtom(imageTypeAtom);

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          이미지
        </CreateWorkloadSectionTitle>
        <GuideTooltip title={<WorkloadImageTooltipTitle />} />
        {/* <Tooltip maxWidth="540px" title={<WorkloadImageTooltipTitle />}>
          <IconWrapper>
            <Icon name="Tooltip" size={16} color="#5F6368" />
          </IconWrapper>
        </Tooltip> */}
      </Header>
      <ImageButtonGroup>
        <CreateWorkloadImageButton
          type="HUB"
          setType={setImageType}
          isSelected={imageType === "HUB"}
          disabled={jobType === "INTERACTIVE"}
        />
      </ImageButtonGroup>
      <ImageSelectionContainer>
        {imageType === "HUB" && <CreateWorkloadHubImageSelect />}
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
