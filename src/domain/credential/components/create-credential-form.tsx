"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Dropdown, FormItem, Input } from "xiilab-ui";

import { CREDENTIAL_TYPE_OPTIONS } from "@/domain/credential/constants/credential.constant";
import { useSelect } from "@/shared/hooks/use-select";
import { FormRow } from "@/styles/layers/form-layer.styled";

export function CreateCredentialForm() {
  /**
   * 크레덴셜 타입 선택
   */
  const credentialType = useSelect(null, CREDENTIAL_TYPE_OPTIONS);
  /**
   * 크레덴셜 이름
   */
  const [credentialName, setCredentialName] = useState("");
  /**
   * 크레덴셜 설명
   */
  const [credentialDescription, setCredentialDescription] = useState("");
  /**
   * 크레덴셜 아이디
   */
  const [credentialId, setCredentialId] = useState("");
  /**
   * 크레덴셜 토큰
   */
  const [credentialToken, setCredentialToken] = useState("");

  const handleCreateCredential = () => {
    toast.success("크레덴셜 생성 완료");
  };

  return (
    <Container>
      <StyledFormRow>
        <StyledFormItem label="타입">
          <Dropdown
            options={credentialType.options}
            value={credentialType.value}
            onChange={credentialType.onChange}
            width="100%"
          />
        </StyledFormItem>
        <StyledFormItem label="이름">
          <Input
            value={credentialName}
            onChange={(e) => setCredentialName(e.target.value)}
            placeholder="이름을 입력해 주세요."
            width="100%"
          />
        </StyledFormItem>
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormItem label="설명">
          <Input
            value={credentialDescription}
            onChange={(e) => setCredentialDescription(e.target.value)}
            placeholder="설명을 입력해 주세요."
            width="100%"
          />
        </StyledFormItem>
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormItem label="아이디">
          <Input
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="아이디를 입력해 주세요."
            width="100%"
          />
        </StyledFormItem>
        <StyledFormItem label="토큰">
          <Input
            value={credentialToken}
            onChange={(e) => setCredentialToken(e.target.value)}
            placeholder="토큰을 입력해 주세요."
            width="100%"
          />
        </StyledFormItem>
      </StyledFormRow>

      <Button
        variant="outlined"
        color="primary"
        icon="Plus"
        width="100%"
        height="30px"
        iconSize={20}
        onClick={handleCreateCredential}
      >
        크레덴셜 저장
      </Button>
    </Container>
  );
}

// ===== Styled Components =====

const Container = styled.div`
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const StyledFormRow = styled(FormRow)`
  gap: 8px;
`;

const StyledFormItem = styled(FormItem)`
  flex: 1;
`;
