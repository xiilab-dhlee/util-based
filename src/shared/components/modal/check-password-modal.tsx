"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { Icon, Input, Modal } from "xiilab-ui";

import type { CheckPasswordPayload } from "@/domain/account-management/types/account.type";
import { LoggedInUserCard } from "@/shared/components/card/logged-in-user-card";
import { FormLabel } from "@/shared/components/form/form-label";
import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openCheckPasswordModalAtom } from "@/shared/state/modal.atom";
import { FormItem } from "@/styles/layers/form-layer.styled";

interface CheckPasswordEventPayload {
  name: string;
  email: string;
}

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

  const handleSubmit = () => {
    const payload = createPayload();

    // NOTE: 추후 실제 비밀번호 검증 mutation으로 연결 필요
    // - 현재 이 모달은 UI만 존재하며, 실제 비밀번호 검증 API 호출은 임시로 비활성화합니다.
    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (!payload) return;

    // UX 상 현재는 “확인” 시 닫히도록 처리(실제 연결 시 onSuccess에서 닫는 흐름으로 변경)
    onClose();
  };

  const createPayload = (): CheckPasswordPayload | null => {
    if (!formRef.current) return null;
    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      accountname: email,
      password: formData.get("checkPassword") as string,
    };
  };

  useSubscribe<CheckPasswordEventPayload>(
    COMMON_EVENTS.sendCheckPassword,
    ({ name, email }) => {
      setUsername(name);
      setEmail(email);

      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Lock" color="#fff" size={18} />}
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
