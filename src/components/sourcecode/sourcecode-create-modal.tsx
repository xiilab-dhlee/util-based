"use client";

import { useState } from "react";
import styled from "styled-components";
import type { TabsSeparatedItem } from "xiilab-ui";
import {
  Button,
  Dropdown,
  Input,
  Modal,
  TabsSeparated,
  Typography,
} from "xiilab-ui";

import { FormLabel } from "@/components/common/form/form-label";
import { MyIcon } from "@/components/common/icon";
import type { SourcecodeParameterType } from "@/schemas/sourcecode.schema";
import type { CreateSourcecodePayload } from "@/types/sourcecode/sourcecode.type";

interface SourceCodeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateSourcecodePayload) => void;
}

/**
 * 워크로드용 소스코드 생성 모달 컴포넌트
 */
export function SourceCodeCreateModal({
  isOpen,
  onClose,
  onCreate,
}: SourceCodeCreateModalProps) {
  const [gitType, setGitType] = useState<string>("Github");
  const [gitUrl, setGitUrl] = useState("");
  const [credentialEnabled, setCredentialEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("select");
  const [selectedCredential, setSelectedCredential] = useState<
    string | undefined
  >(undefined);
  const [mountPath, setMountPath] = useState("");
  const [executeCommand, setExecuteCommand] = useState("");
  const [parameters, setParameters] = useState<SourcecodeParameterType[]>([]);

  const gitTypeOptions = [
    { label: "Github", value: "Github" },
    { label: "Gitlab", value: "Gitlab" },
  ];

  const credentialOptions = [
    { label: "크레덴셜 1", value: "credential-1" },
    { label: "크레덴셜 2", value: "credential-2" },
    { label: "크레덴셜 3", value: "credential-3" },
  ];

  const credentialTabs: TabsSeparatedItem[] = [
    {
      key: "select",
      label: "크레덴셜 선택",
    },
    {
      key: "add",
      label: "크레덴셜 추가",
    },
  ];

  const handleAddParameter = () => {
    setParameters([...parameters, { key: "", value: "" }]);
  };

  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleParameterChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setParameters(
      parameters.map((param, i) =>
        i === index ? { ...param, [field]: value } : param,
      ),
    );
  };

  const handleValidateUrl = () => {
    // URL 검증 로직
    console.log("URL 검증:", gitUrl);
    // TODO: 실제 API 호출
  };

  const handleCreate = () => {
    if (gitUrl && mountPath && executeCommand) {
      const data: CreateSourcecodePayload = {
        gitUrl,
        gitType,
        mountPath,
        executeCommand,
        parameters: parameters.filter((p) => p.key && p.value),
      };

      if (credentialEnabled && selectedCredential) {
        data.credentialId = selectedCredential;
      }

      onCreate(data);
      handleReset();
      onClose();
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setGitType("Github");
    setGitUrl("");
    setCredentialEnabled(false);
    setActiveTab("select");
    setSelectedCredential(undefined);
    setMountPath("");
    setExecuteCommand("");
    setParameters([]);
  };

  return (
    <Modal
      type="primary"
      icon={<MyIcon name="Plus" color="#fff" size={18} />}
      modalWidth={580}
      open={isOpen}
      closable
      title="소스코드 생성"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="생성"
      onOk={handleCreate}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !gitUrl || !mountPath || !executeCommand,
      }}
    >
      <ModalContent>
        {/* Git URL */}
        <FormSection>
          <FormLabel>Git URL</FormLabel>
          <GitUrlRow>
            <GitTypeDropdown>
              <Dropdown
                options={gitTypeOptions}
                value={gitType}
                onChange={(value) => setGitType(value)}
                width="100%"
              />
            </GitTypeDropdown>
            <GitUrlInput>
              <Input
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="http://github.com/astrago-ai"
                width="100%"
              />
            </GitUrlInput>
          </GitUrlRow>
        </FormSection>

        {/* 크레덴셜 */}
        <FormSection>
          <FormLabel>크레덴셜</FormLabel>
          <ToggleButton
            $enabled={credentialEnabled}
            onClick={() => setCredentialEnabled(!credentialEnabled)}
          >
            <ToggleOption $active={credentialEnabled}>on</ToggleOption>
            <ToggleOption $active={!credentialEnabled}>off</ToggleOption>
          </ToggleButton>
        </FormSection>

        {/* 크레덴셜 ON일 때 탭 표시 */}
        {credentialEnabled && (
          <CredentialSection>
            <TabsSeparated
              items={credentialTabs}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
            />
            {activeTab === "select" ? (
              <CredentialContent>
                <Dropdown
                  options={credentialOptions}
                  value={selectedCredential}
                  onChange={(value) => setSelectedCredential(value)}
                  placeholder="Git 리포지토리를 추가하시려면 크레덴셜을 선택해 주세요."
                  width="100%"
                />
              </CredentialContent>
            ) : (
              <CredentialAddContent>
                <FormRow>
                  <FormColumn>
                    <FormLabel>타입</FormLabel>
                    <Dropdown
                      options={[
                        { label: "Git", value: "Git" },
                        { label: "Github", value: "Github" },
                        { label: "Gitlab", value: "Gitlab" },
                      ]}
                      value="Git"
                      onChange={() => {}}
                      width="100%"
                    />
                  </FormColumn>
                  <FormColumn>
                    <FormLabel>이름</FormLabel>
                    <Input placeholder="이름을 입력해 주세요." width="100%" />
                  </FormColumn>
                </FormRow>

                <FormSection>
                  <FormLabel>설명</FormLabel>
                  <Input placeholder="설명을 입력해 주세요." width="100%" />
                </FormSection>

                <FormRow>
                  <FormColumn>
                    <FormLabel>아이디</FormLabel>
                    <Input placeholder="아이디를 입력해 주세요." width="100%" />
                  </FormColumn>
                  <FormColumn>
                    <FormLabel>토큰</FormLabel>
                    <Input placeholder="토큰을 입력해 주세요." width="100%" />
                  </FormColumn>
                </FormRow>

                <Button
                  variant="outlined"
                  color="primary"
                  icon="Plus"
                  width="100%"
                  height="34px"
                >
                  크레덴셜 저장
                </Button>
              </CredentialAddContent>
            )}
          </CredentialSection>
        )}

        {/* URL 검증 버튼 */}
        <ValidateButton
          variant="outlined"
          color="primary"
          onClick={handleValidateUrl}
          width="100%"
          height="34px"
        >
          URL 검증
        </ValidateButton>

        {/* 기본 마운트 경로 & 실행 명령어 */}
        <TwoColumnRow>
          <FormSection>
            <FormLabel>기본 마운트 경로</FormLabel>
            <Input
              value={mountPath}
              onChange={(e) => setMountPath(e.target.value)}
              placeholder="Mount path를 입력해 주세요. 예) /root/volume/123"
              width="100%"
            />
          </FormSection>
          <FormSection>
            <FormLabel>실행 명령어</FormLabel>
            <Input
              value={executeCommand}
              onChange={(e) => setExecuteCommand(e.target.value)}
              placeholder="실행 명령어를 입력해 주세요. 예) /root/code/main.py"
              width="100%"
            />
          </FormSection>
        </TwoColumnRow>

        {/* 파라미터 */}
        <FormSection>
          <ParameterHeader>
            <FormLabel>파라미터</FormLabel>
            <AddParameterButton onClick={handleAddParameter}>
              <MyIcon name="PlusCircle" size={16} color="#666666" />
              <Typography.Text variant="body-2-4" color="#666666">
                파라미터 추가
              </Typography.Text>
            </AddParameterButton>
          </ParameterHeader>

          {parameters.length > 0 && (
            <ParametersContainer>
              <ParameterLabels>
                <Typography.Text variant="body-2-4" color="#000000">
                  키
                </Typography.Text>
                <Typography.Text variant="body-2-4" color="#000000">
                  값
                </Typography.Text>
              </ParameterLabels>
              {parameters.map((param, index) => (
                <ParameterRow key={param.key}>
                  <Input
                    value={param.key}
                    onChange={(e) =>
                      handleParameterChange(index, "key", e.target.value)
                    }
                    placeholder="키를 입력해주세요."
                    width="100%"
                  />
                  <Input
                    value={param.value}
                    onChange={(e) =>
                      handleParameterChange(index, "value", e.target.value)
                    }
                    placeholder="값을 입력해주세요."
                    width="100%"
                  />
                  <DeleteButton
                    variant="text"
                    icon="Close"
                    onClick={() => handleRemoveParameter(index)}
                    width="30px"
                    height="30px"
                  />
                </ParameterRow>
              ))}
            </ParametersContainer>
          )}
        </FormSection>
      </ModalContent>
    </Modal>
  );
}

// ===== Styled Components =====

const ModalContent = styled.div`
  padding: 6px 0;
  padding-right: 12px;
  margin-right: -12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #dddddd;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #c0c0c0;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GitUrlRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const GitTypeDropdown = styled.div`
  width: 266px;
`;

const GitUrlInput = styled.div`
  flex: 1;
`;

const ValidateButton = styled(Button)`
  flex-shrink: 0;
`;

const ToggleButton = styled.div<{ $enabled: boolean }>`
  display: inline-flex;
  background: #e1e4e7;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  width: 56px;
  height: 16px;
`;

const ToggleOption = styled.div<{ $active: boolean }>`
  font-family: Pretendard;
  font-size: 10px;
  font-weight: ${(props) => (props.$active ? 500 : 400)};
  line-height: 12px;
  color: ${(props) => (props.$active ? "#ffffff" : "#5f6368")};
  background: ${(props) => (props.$active ? "#3268FF" : "transparent")};
  border: ${(props) => (props.$active ? "1px solid #2659E3" : "none")};
  transition: all 0.2s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TwoColumnRow = styled.div`
  display: flex;
  gap: 12px;

  > * {
    flex: 1;
  }
`;

const ParameterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddParameterButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

const ParametersContainer = styled.div`
  padding: 10px;
  background: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ParameterLabels = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 2px;

  > *:first-child {
    width: 238px;
  }

  > *:last-child {
    flex: 1;
  }
`;

const ParameterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  > *:first-child {
    width: 238px;
  }

  > *:nth-child(2) {
    flex: 1;
  }
`;

const DeleteButton = styled(Button)`
  flex-shrink: 0;
`;

const CredentialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CredentialContent = styled.div`
  padding: 8px 0;
`;

const CredentialAddContent = styled.div`
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 8px;

  > * {
    flex: 1;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
