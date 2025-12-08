"use client";

import { useState } from "react";

import type { MemberRow } from "@/shared/components/column/create-member-column";
import { MemberSelectionModal } from "@/shared/components/modal/member-selection-modal";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import type {
  MemberSelectionPayload,
  SelectedMember,
} from "@/shared/types/member-selection.type";
import { openAddWorkspaceMemberModalAtom } from "../state/setting.atom";

/**
 * 워크스페이스 구성원 추가 모달 페이로드
 */
export type AddWorkspaceMemberPayload = MemberSelectionPayload;

/**
 * 워크스페이스 구성원 추가 모달
 */
export function AddWorkspaceMemberModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openAddWorkspaceMemberModalAtom,
  );

  const [initialAccounts, setInitialAccounts] = useState<SelectedMember[]>([]);

  // PubSub 구독 - 멤버 모달 열기 이벤트
  useSubscribe<AddWorkspaceMemberPayload>(
    SETTING_EVENTS.sendAddWorkspaceMember,
    (payload) => {
      setInitialAccounts(payload.selectedAccounts);
      onOpen();
    },
  );

  const handleConfirm = (_members: MemberRow[]) => {
    // TODO: 구성원 추가 API 호출
  };

  return (
    <MemberSelectionModal
      open={open}
      title="워크스페이스 구성원 추가"
      initialAccounts={initialAccounts}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
