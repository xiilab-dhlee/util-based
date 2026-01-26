"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Form, Icon, Input, Modal } from "xiilab-ui";

import { useGetProfile } from "@/api/generated/account-profile/account-profile";
import { useVerifyPassword } from "@/domain/profile/hooks/use-verify-password";
import { LoggedInUserCard } from "@/shared/components/card/logged-in-user-card";
import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openCheckPasswordModalAtom } from "@/shared/state/modal.atom";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

/**
 * 비밀번호 재확인 모달 컴포넌트
 *
 * 회원 정보 보호를 위해 사용자의 비밀번호를 다시 한번 확인하는 모달입니다.
 * 중요한 작업 수행 전 사용자 인증을 위해 사용됩니다.
 */
export function CheckPasswordModal() {
  const publish = usePublish();
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const { open, onOpen, onClose } = useGlobalModal(openCheckPasswordModalAtom);

  const { data: profile } = useGetProfile(accountId, {
    query: { enabled: Boolean(accountId) && open },
  });

  const {
    mutate: verifyPassword,
    isPending,
    data,
    reset: resetMutation,
  } = useVerifyPassword();

  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!password) {
      setValidationError("비밀번호를 입력해 주세요.");
      return;
    }
    setValidationError(null);

    verifyPassword(password, {
      onSuccess: (result) => {
        if (result.success) {
          onClose();
          setPassword("");
          publish(COMMON_EVENTS.sendUpdateProfile);
        }
      },
    });
  };

  const passwordError = data?.error;

  const handleClose = () => {
    resetMutation();
    setPassword("");
    setValidationError(null);
    onClose();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  useSubscribe(COMMON_EVENTS.sendCheckPassword, () => {
    resetMutation();
    setPassword("");
    onOpen();
  });

  const mergedErrorMessage = validationError ?? passwordError;
  const validateStatus = mergedErrorMessage ? "error" : undefined;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Lock" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="비밀번호 재확인"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="확인"
      onOk={handleSubmit}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      centered
      showHeaderBorder
    >
      <Guide>회원 정보 보호를 위해 비밀번호를 다시 한번 입력해 주세요.</Guide>
      <LoggedInUserCard
        username={profile?.accountName ?? "-"}
        email={profile?.email ?? "-"}
      />
      <Form layout="vertical">
        <LastFormItem
          label="비밀번호"
          required
          help={mergedErrorMessage}
          validateStatus={validateStatus}
        >
          <Input
            type="password"
            id="checkPassword"
            name="checkPassword"
            placeholder="비밀번호를 입력해주세요."
            autoComplete="current-password"
            width="100%"
            value={password}
            onChange={handlePasswordChange}
            status={validateStatus}
          />
        </LastFormItem>
      </Form>
    </Modal>
  );
}

const Guide = styled.div`
  color: #000;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  margin-bottom: 12px;
`;
