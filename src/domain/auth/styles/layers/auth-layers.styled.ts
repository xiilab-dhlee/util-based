import styled from "styled-components";
import { Button, Form } from "xiilab-ui";

/**
 * Auth 도메인 공통 스타일 컴포넌트
 * LicenseMain, SignupMain 등에서 공유하는 레이아웃 스타일
 */

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AuthHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 36px;
`;

export const AuthTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const AuthTitleIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #5b29c7;
  margin-right: 6px;
  overflow: hidden;

  --icon-fill: #fff;
`;

export const AuthForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  --icon-fill: #969a9f;
`;

export const AuthSubmitButton = styled(Button)`
  margin-top: 8px;
`;
