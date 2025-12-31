"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { AUTH_SELECTOR } from "@/shared/constants/selector.constant";

export function CompleteSignup() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/signin");
  };

  return (
    <SuccessContainer data-testid={AUTH_SELECTOR.SIGNUP_SUCCESS_CONTAINER}>
      <SuccessHeader data-testid={AUTH_SELECTOR.SIGNUP_HEADER}>
        <Image
          src="/images/success-background.png"
          alt="confirm-signup"
          width={264}
          height={230}
        />
      </SuccessHeader>
      <SuccessBody>
        <Typography.Title variant="headline-3-1" color="#000">
          회원 가입 완료
        </Typography.Title>
        <Typography.Title variant="subtitle-2-3" color="#333">
          관리자가 사용자의 가입 정보를 확인하고 있습니다.
          <br />
          승인 시 가입 계정으로 이메일이 전송됩니다.
        </Typography.Title>
      </SuccessBody>
      <SuccessFooter>
        <Button
          type="button"
          color="primary"
          variant="gradient"
          width="100%"
          height={34}
          onClick={handleLogin}
          data-testid={AUTH_SELECTOR.SIGNUP_GO_TO_LOGIN_BUTTON}
        >
          로그인 페이지로 이동
        </Button>
      </SuccessFooter>
    </SuccessContainer>
  );
}

// ============================================
// Styled Components - 회원가입 성공 UI
// ============================================

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SuccessHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SuccessBody = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 20px;
`;

const SuccessFooter = styled.footer`
  margin-top: 50px;
`;
