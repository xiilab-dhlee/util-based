"use client";

import { useState } from "react";
import styled from "styled-components";
import type { TabsSeparatedItem } from "xiilab-ui";
import {
  Button,
  Dropdown,
  Form,
  FormItem,
  Icon,
  Input,
  Modal,
  Switch,
} from "xiilab-ui";

import { CreateCredentialForm } from "@/domain/credential/components/create-credential-form";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import type { CredentialIdType } from "@/domain/credential/schemas/credential.schema";
import type {
  SourcecodeCodeType,
  SourcecodeStatusType,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import { FormLabel } from "@/shared/components/form/form-label";
import { StateTab } from "@/shared/components/tab";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSelect } from "@/shared/hooks/use-select";
import { FormRow } from "@/styles/layers/form-layer.styled";
import { hideScrollbar } from "@/styles/mixins/scrollbar";
import {
  SOURCECODE_STATUS_OPTIONS,
  SOURCECODE_TYPE_OPTIONS,
} from "../constants/sourcecode.constant";
import { openCreateSourcecodeModalAtom } from "../state/sourcecode.atom";
import { ManageParameter } from "./manage-parameter";

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "select",
    label: "크레덴셜 선택",
    icon: "Verification02",
  },
  {
    key: "create",
    label: "크레덴셜 추가",
    icon: "PlusSquare",
  },
];

export function CreateSourcecodeModal() {
  const { open, onClose } = useGlobalModal(openCreateSourcecodeModalAtom);
  /**
   * 소스코드 이름
   */
  const [name, setName] = useState("");
  /**
   * 소스코드 공개 설정
   */
  const status = useSelect<SourcecodeStatusType>(
    null,
    SOURCECODE_STATUS_OPTIONS,
  );
  /**
   * 소스코드 Git URL
   */
  const [gitUrl, setGitUrl] = useState("");
  /**
   * 소스코드 Git 타입
   */
  const gitType = useSelect<SourcecodeCodeType>(null, SOURCECODE_TYPE_OPTIONS);

  // 현재 선택된 탭 상태 관리
  const [credentialTab, setCredentialTab] = useState("select");
  const [credential, setCredential] = useState<CredentialIdType | null>(null);
  const [mountPath, setMountPath] = useState("");
  const [executeCommand, setExecuteCommand] = useState("");

  // 크레덴셜 관련
  const [credentialEnabled, setCredentialEnabled] = useState(false);

  const handleValidateUrl = () => {
    alert("준비 중입니다.");
  };

  const handleSubmit = () => {};

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable
      title="소스코드 생성"
      onCancel={onClose}
      showCancelButton
      cancelText="취소"
      okText="생성"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !gitUrl || !mountPath || !executeCommand,
      }}
    >
      <StyledForm layout="vertical">
        {/* 소스코드 이름 */}
        <StyledFormRow>
          <StyledFormItem label="소스코드 이름">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="http://github.com/astrago-ai"
              width="100%"
            />
          </StyledFormItem>
          <StyledFormItem label="공개 설정">
            <Dropdown
              options={status.options}
              value={status.value}
              onChange={status.onChange}
              width="100%"
            />
          </StyledFormItem>
        </StyledFormRow>
        {/* Git URL */}
        <StyledFormRow>
          <StyledFormItem label="Git URL">
            <Dropdown
              options={gitType.options}
              value={gitType.value}
              onChange={gitType.onChange}
              width="100%"
            />
          </StyledFormItem>
          <StyledFormItem label=" ">
            <Input
              value={gitUrl}
              onChange={(e) => setGitUrl(e.target.value)}
              placeholder="http://github.com/astrago-ai"
              width="100%"
            />
          </StyledFormItem>
        </StyledFormRow>
        {/* 크레덴셜 */}
        <CredentialRow>
          <CredentialLabel>
            <FormLabel>크레덴셜</FormLabel>
            <Switch
              checked={credentialEnabled}
              onChange={() => setCredentialEnabled(!credentialEnabled)}
            />
          </CredentialLabel>
          {/* 크레덴셜 ON일 때 탭 표시 */}
          {credentialEnabled && (
            <CredentialBody>
              <StateTab
                items={TAB_ITEMS}
                selectedKey={credentialTab}
                setSelectedKey={setCredentialTab}
              />
              {credentialTab === "select" && (
                <CredentialSelect value={credential} setValue={setCredential} />
              )}
              {credentialTab === "create" && <CreateCredentialForm />}
            </CredentialBody>
          )}
        </CredentialRow>

        {/* URL 검증 버튼 */}
        <UrlValidateButton
          variant="outlined"
          color="primary"
          onClick={handleValidateUrl}
          width="100%"
          height="30px"
          icon="Verification02"
          iconPosition="left"
          iconSize={18}
          iconColor="#154FED"
        >
          URL 검사
        </UrlValidateButton>

        {/* 기본 마운트 경로 & 실행 명령어 */}
        <StyledFormRow>
          <StyledFormItem label="기본 마운트 경로">
            <Input
              value={mountPath}
              onChange={(e) => setMountPath(e.target.value)}
              placeholder="Mount path를 입력해 주세요. 예) /root/volume/123"
              width="100%"
            />
          </StyledFormItem>
          <StyledFormItem label="실행 명령어">
            <Input
              value={executeCommand}
              onChange={(e) => setExecuteCommand(e.target.value)}
              placeholder="실행 명령어를 입력해 주세요. 예) /root/code/main.py"
              width="100%"
            />
          </StyledFormItem>
        </StyledFormRow>
        {/* 파라미터 */}
        <StyledFormItem label="파라미터" className="last">
          <ManageParameter />
        </StyledFormItem>
      </StyledForm>
    </Modal>
  );
}

// ===== Styled Components =====

const StyledForm = styled(Form)`
  overflow-y: auto;
  max-height: 510px;

  ${hideScrollbar}
`;

const StyledFormRow = styled(FormRow)`
  gap: 8px;
`;

const StyledFormItem = styled(FormItem)`
  flex: 1;

  &.last {
    margin-bottom: 0;
  }
`;

const CredentialLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;

const CredentialBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
`;

const CredentialRow = styled.div``;

const UrlValidateButton = styled(Button)`
  margin-bottom: 16px;
`;
