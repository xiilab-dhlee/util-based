"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { Input, Modal } from "xiilab-ui";

import { openCheckPasswordModalAtom } from "@/atoms/common/modal.atom";
import { LoggedInUserCard } from "@/components/common/card/logged-in-user-card";
import { FormItem } from "@/components/common/form/form-item";
import { FormLabel } from "@/components/common/form/form-label";
import { MyIcon } from "@/components/common/icons";
import pubsubConstants from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useCheckPassword } from "@/hooks/user/use-check-password";
import type { UserListType } from "@/schemas/user.schema";
import type { CheckPasswordPayload } from "@/types/user/user.type";

/**
 * 비밀번호 재확인 모달 컴포넌트
 *
 * 회원 정보 보호를 위해 사용자의 비밀번호를 다시 한번 확인하는 모달입니다.
 * 중요한 작업 수행 전 사용자 인증을 위해 사용됩니다.
 */
export function CheckPasswordModal() {
  const formRef = useRef<HTMLFormElement>(null);

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openCheckPasswordModalAtom);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const checkPassword = useCheckPassword();

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      // TODO: validation 추가 필요
      // checkUser.mutate(payload);
      onClose();
    }
  };

  const createPayload = (): CheckPasswordPayload | null => {
    if (!formRef.current) return null;
    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      username: email,
      password: formData.get("checkPassword") as string,
    };
  };

  useSubscribe<Pick<UserListType, "name" | "email">>(
    pubsubConstants.common.sendCheckPassword,
    ({ name, email }) => {
      setUsername(name);
      setEmail(email);

      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<MyIcon name="Lock" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="비밀번호 재확인"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: checkPassword.isPending,
      }}
    >
      <Guide>회원 정보 보호를 위해 비밀번호를 다시 한번 입력해 주세요.</Guide>
      <LoggedInUserCard username={username} email={email} />
      <form ref={formRef} style={{ marginTop: 16 }} autoComplete="off">
        {/* 마운트 경로 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="checkPassword">비밀번호</FormLabel>
          <Input
            type="password"
            id="checkPassword"
            name="checkPassword"
            placeholder="비밀번호를 입력해주세요."
            autoComplete="new-password"
            width="100%"
          />
        </FormItem>
      </form>
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
