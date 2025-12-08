"use client";

import { useState } from "react";

import { openMemberModalAtom } from "@/domain/group/state/group.atom";
import type { OpenMemberModalPayload } from "@/domain/group/types/group.type";
import type { MemberRow } from "@/shared/components/column/create-member-column";
import { MemberSelectionModal } from "@/shared/components/modal/member-selection-modal";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
/**
 * 그룹 멤버 추가 모달
 *
 * PubSub 패턴을 사용하여 ManageGroupModal과 상태를 공유합니다.
 */
export function ManageGroupMemberModal() {
  const { open, onOpen, onClose } = useGlobalModal(openMemberModalAtom);
  const publish = usePublish();

  const [initialAccounts, setInitialAccounts] = useState<
    OpenMemberModalPayload["selectedAccounts"]
  >([]);

  // PubSub 구독 - 멤버 모달 열기 이벤트
  useSubscribe<OpenMemberModalPayload>(
    GROUP_EVENTS.openMemberModal,
    (payload) => {
      setInitialAccounts(payload.selectedAccounts);
      onOpen();
    },
  );

  const handleConfirm = (members: MemberRow[]) => {
    publish(GROUP_EVENTS.confirmMemberSelection, {
      members,
    });
  };

  return (
    <MemberSelectionModal
      open={open}
      title="멤버 추가"
      initialAccounts={initialAccounts}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
