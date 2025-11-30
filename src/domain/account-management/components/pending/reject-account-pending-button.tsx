"use client";

import { Icon } from "xiilab-ui";

import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface RejectAccountPendingButtonProps {
  /** 사용자 데이터 */
  account: AccountListType;
}

/**
 * 개별 가입 반려 버튼 컴포넌트
 *
 * 테이블 row에서 개별 가입 신청을 반려할 수 있는 버튼입니다.
 * 클릭 시 확인 모달이 표시됩니다.
 */
export function RejectAccountPendingButton({
  account,
}: RejectAccountPendingButtonProps) {
  const publish = usePublish();

  /**
   * 반려 버튼 클릭 핸들러
   */
  const handleClick = () => {
    publish(ACCOUNT_EVENTS.sendRejectAccountPending, {
      accountIds: [account.id],
      accountNames: [account.name],
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClick}>
        <Icon name="Close" color="var(--icon-fill)" />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
