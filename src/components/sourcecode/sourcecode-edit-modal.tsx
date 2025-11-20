"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Dropdown,
  Icon,
  Input,
  Modal,
  Tag,
  Tooltip,
  Typography,
} from "xiilab-ui";

import { FormLabel } from "@/components/common/form/form-label";

/**
 * 소스코드 수정 모달의 props 인터페이스
 */
interface SourceCodeEditModalProps {
  /** 모달이 열려있는지 여부 */
  isOpen: boolean;
  /** 모달을 닫을 때 호출되는 콜백 함수 */
  onClose: () => void;
  /** 저장 시 호출되는 콜백 함수, 저장된 데이터를 전달 */
  onSave: (data: {
    branch: string;
    mountPath: string;
    executeCommand: string;
  }) => void;
  /** 현재 소스코드 데이터 */
  currentData: {
    /** 소스코드 저장소 URL */
    url: string;
    /** 브랜치명 */
    branch: string;
    /** 마운트 경로 */
    mountPath: string;
    /** 실행 명령어 */
    executeCommand: string;
    /** 소스 타입 (Github 또는 Gitlab) */
    sourceType: "Github" | "Gitlab";
  };
  /** 브랜치 옵션 목록 (선택사항) */
  branchOptions?: { label: string; value: string }[];
}

/**
 * 소스코드 수정 모달 컴포넌트
 */
export function SourceCodeEditModal({
  isOpen,
  onClose,
  onSave,
  currentData,
  branchOptions = [
    { label: "main", value: "main" },
    { label: "develop", value: "develop" },
    { label: "feature/model-update", value: "feature/model-update" },
  ],
}: SourceCodeEditModalProps) {
  const [branch, setBranch] = useState(currentData.branch);
  const [mountPath, setMountPath] = useState(currentData.mountPath);
  const [executeCommand, setExecuteCommand] = useState(
    currentData.executeCommand,
  );

  // currentData가 변경될 때마다 상태 업데이트
  useEffect(() => {
    setBranch(currentData.branch);
    setMountPath(currentData.mountPath);
    setExecuteCommand(currentData.executeCommand);
  }, [currentData]);

  const handleSave = () => {
    if (branch && mountPath.trim() && executeCommand.trim()) {
      onSave({
        branch,
        mountPath: mountPath.trim(),
        executeCommand: executeCommand.trim(),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    // 원래 값으로 되돌리기
    setBranch(currentData.branch);
    setMountPath(currentData.mountPath);
    setExecuteCommand(currentData.executeCommand);
    onClose();
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={isOpen}
      closable
      title="소스코드 수정"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="수정 완료"
      onOk={handleSave}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !branch || !mountPath.trim() || !executeCommand.trim(),
      }}
    >
      <ModalContent>
        {/* 소스코드 URL (읽기 전용) */}
        <SourceCodeUrlSection>
          <FormLabel>소스코드</FormLabel>
          <UrlBox>
            <SourceTypeTag
              variant={currentData.sourceType === "Github" ? "red" : "blue"}
            >
              {currentData.sourceType}
            </SourceTypeTag>
            <UrlText variant="body-2-4" color="#464B51">
              {currentData.url}
            </UrlText>
          </UrlBox>
        </SourceCodeUrlSection>

        {/* Branch 선택 */}
        <FormSection>
          <FormLabel htmlFor="branch">Branch</FormLabel>
          <Dropdown
            id="branch"
            options={branchOptions}
            value={branch}
            onChange={(value) => setBranch(value)}
            placeholder="Branch를 선택해 주세요."
            width="100%"
          />
        </FormSection>

        {/* 기본 마운트 경로 입력 */}
        <FormSection>
          <FormLabel htmlFor="mountPath">기본 마운트 경로</FormLabel>
          <Input
            id="mountPath"
            value={mountPath}
            onChange={(e) => setMountPath(e.target.value)}
            placeholder="Mount path를 입력해 주세요."
            width="100%"
          />
        </FormSection>

        {/* 실행 명령어 입력 */}
        <FormSection>
          <LabelWithTooltip>
            <FormLabel htmlFor="executeCommand">실행 명령어</FormLabel>
            <Tooltip
              title={
                <TooltipContent>
                  소스코드 실행을 위한 명령어를 입력합니다.
                </TooltipContent>
              }
            >
              <TooltipIconWrapper>
                <Icon name="Tooltip" size={16} color="#5F6368" />
              </TooltipIconWrapper>
            </Tooltip>
          </LabelWithTooltip>
          <Input
            id="executeCommand"
            value={executeCommand}
            onChange={(e) => setExecuteCommand(e.target.value)}
            placeholder="실행 명령어를 입력해 주세요."
            width="100%"
          />
        </FormSection>
      </ModalContent>
    </Modal>
  );
}

// ===== Styled Components =====

const ModalContent = styled.div`
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SourceCodeUrlSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UrlBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  min-height: 36px;
`;

const SourceTypeTag = styled(Tag)`
  height: 20px;
  padding: 2px 8px;
  font-size: 10px;
  flex-shrink: 0;
`;

const UrlText = styled(Typography.Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelWithTooltip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TooltipIconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TooltipContent = styled.span`
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 400;
  line-height: 16px;
  color: #000000;
`;
