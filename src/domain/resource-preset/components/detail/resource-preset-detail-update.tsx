"use client";

import styled from "styled-components";
import { Button } from "xiilab-ui";

import { CreateResourcePresetBasicInfo } from "@/domain/resource-preset/components/create/create-resource-preset-basic-info";
import { CreateResourcePresetGpuInfo } from "@/domain/resource-preset/components/create/create-resource-preset-gpu-info";
import { CreateResourcePresetJobType } from "@/domain/resource-preset/components/create/create-resource-preset-job-type";
import { CreateResourcePresetResourceInfo } from "@/domain/resource-preset/components/create/create-resource-preset-resource-info";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import {
  AsideDetailFooter,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
  AsideDetailScrollWrapper,
} from "@/styles/layers/aside-detail-layers.styled";

interface ResourcePresetDetailUpdateProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}

/**
 * 리소스 프리셋 수정 컴포넌트
 *
 * Create 컴포넌트들을 재사용하여 리소스 프리셋 수정 폼을 표시합니다.
 * 순수한 presentational 컴포넌트로, 비즈니스 로직은 Main 컴포넌트에서 처리합니다.
 */
export function ResourcePresetDetailUpdate({
  onCancel,
  onSave,
  isSaving,
}: ResourcePresetDetailUpdateProps) {
  return (
    <>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>리소스 프리셋 수정</AsideDetailHeaderTitle>
      </AsideDetailHeader>

      <AsideDetailScrollWrapper>
        <CustomScrollbars>
          <ScrollContent>
            <CreateResourcePresetBasicInfo />
            <CreateResourcePresetJobType />
            <CreateResourcePresetGpuInfo />
            <CreateResourcePresetResourceInfo />
          </ScrollContent>
        </CustomScrollbars>
      </AsideDetailScrollWrapper>

      <AsideDetailFooter>
        <Button width={112} variant="outlined" onClick={onCancel}>
          취소
        </Button>
        <Button
          color="primary"
          icon="Check"
          iconPosition="left"
          iconSize={20}
          size="medium"
          variant="gradient"
          width="100%"
          onClick={onSave}
          loading={isSaving}
        >
          상세 정보 저장
        </Button>
      </AsideDetailFooter>
    </>
  );
}

/**
 * 스크롤 컨텐츠 스타일
 *
 * Scrollbars 내부의 컨텐츠를 감싸는 컨테이너입니다.
 * 컨텐츠 간 간격을 설정합니다.
 */
const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
