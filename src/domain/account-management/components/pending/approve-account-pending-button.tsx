"use client";

import { Button } from "xiilab-ui";

import type { SignupRequestItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface ApproveAccountPendingButtonProps {
  /** 사용자 데이터 */
  account: SignupRequestItemResponse;
}

/**
 * 개별 가입 승인 버튼 컴포넌트
 *
 * 테이블 row에서 개별 가입 신청을 승인할 수 있는 버튼입니다.
 * 클릭 시 확인 모달이 표시됩니다.
 */
export function ApproveAccountPendingButton({
  account,
}: ApproveAccountPendingButtonProps) {
  const publish = usePublish();

  /**
   * 승인 버튼 클릭 핸들러
   */
  const handleClick = () => {
    publish(ACCOUNT_EVENTS.sendApproveAccountPending, {
      accountIds: [account.accountId],
    });
  };

  return <Button icon="Check" onClick={handleClick} aria-label="가입 승인" />;
}
