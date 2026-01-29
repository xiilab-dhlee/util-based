"use client";

import { isBrowser } from "es-toolkit/predicate";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { openResetPasswordResultModalAtom } from "@/domain/account-management/state/account.atom";
import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ResetPasswordResult {
  accountName: string;
  email: string;
  newPassword?: string;
}

type AccountLabelParams = Partial<
  Pick<ResetPasswordResult, "accountName" | "email">
>;

function getAccountLabel({ accountName, email }: AccountLabelParams = {}) {
  const trimmedAccountName = accountName?.trim();
  const trimmedEmail = email?.trim();

  if (trimmedAccountName && trimmedEmail)
    return `${trimmedAccountName}(${trimmedEmail})`;
  if (trimmedAccountName) return trimmedAccountName;
  if (trimmedEmail) return trimmedEmail;
  return "-";
}

/**
 * 클립보드 복사: 보안 컨텍스트에서는 Clipboard API 사용,
 * 그 외에는 execCommand 폴백을 시도합니다.
 */
async function copyTextToClipboard(text: string) {
  if (isBrowser() && navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (!isBrowser()) {
    throw new Error("clipboard-not-available");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const range =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  let isCopied = false;
  let hasFailed = false;

  try {
    textarea.select();
    isCopied = document.execCommand("copy");
    if (!isCopied) {
      hasFailed = true;
    }
  } catch {
    hasFailed = true;
  } finally {
    document.body.removeChild(textarea);
    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  if (hasFailed) {
    throw new Error("clipboard-copy-failed");
  }
}

export function ResetPasswordResultModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openResetPasswordResultModalAtom,
  );
  const [result, setResult] = useState<ResetPasswordResult | null>(null);

  const handleCopyPassword = async () => {
    if (!result?.newPassword) return;

    try {
      await copyTextToClipboard(result.newPassword);
      toast.success("비밀번호가 복사되었습니다.");
    } catch {
      toast.error("비밀번호 복사에 실패했습니다.");
    }
  };

  const handleClose = () => {
    onClose();
    setResult(null);
  };

  useSubscribe(
    ACCOUNT_EVENTS.showResetPasswordResult,
    (data: ResetPasswordResult) => {
      setResult(data);
      onOpen();
    },
  );

  return (
    <InfoModal
      modalWidth={400}
      open={open && !!result?.newPassword}
      variant="success"
      icon={<RefreshIcon width={20} height={20} fill="#fff" />}
      onClose={handleClose}
      title="패스워드 초기화"
      centered
      closable
      maskClosable
      keyboard
      footer={null}
    >
      <ResultContainer>
        <DescriptionText>
          {getAccountLabel({
            accountName: result?.accountName,
            email: result?.email,
          })}{" "}
          사용자의 비밀번호가 초기화되었습니다.
          <br />
          아래에 표시된 비밀번호를 복사하여 사용자에게 전달해 주세요.
          <br />본 창을 닫으면 초기화된 비밀번호는 다시 확인할 수 없습니다.
        </DescriptionText>

        <PasswordBox>
          <PasswordText data-testid={ACCOUNT_SELECTOR.RESET_PASSWORD_RESULT}>
            {result?.newPassword}
          </PasswordText>
          <CopyIconButton onClick={handleCopyPassword}>
            <Icon name="Copy" size={20} color="var(--color-gray-04)" />
          </CopyIconButton>
        </PasswordBox>

        <SMTPNotice>
          <SMTPBullet aria-hidden />
          <SMTPText>
            SMTP를 사용 중인 경우 사용자에게 초기화된 패스워드가 이메일로
            전송됩니다.
          </SMTPText>
        </SMTPNotice>
      </ResultContainer>
    </InfoModal>
  );
}

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DescriptionText = styled.span`
  font-size: 12px;
  line-height: 18px;
`;

const PasswordBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #c1c7ce;
  background-color: #f3f5f7;
  border-radius: 2px;
  overflow: hidden;
  height: 30px;
`;

const PasswordText = styled.span`
  flex: 1;
  padding: 0 12px;
  color: var(--color-gray-04);
  font-size: 12px;
`;

const CopyIconButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    width: 1px;
    height: 14px;
    background-color: #c1c7ce;
    pointer-events: none;
  }
`;

const SMTPNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SMTPBullet = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #454f62;
`;

const SMTPText = styled.span`
  color: #333333;
  font-size: 11px;
  line-height: 16px;
`;
