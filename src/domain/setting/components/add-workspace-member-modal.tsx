"use client";

import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useMemberListReset } from "@/domain/setting/hooks/use-member-list-reset";
import { openAddWorkspaceMemberModalAtom } from "@/domain/setting/state/setting.atom";
import { useAddWorkspaceMembersAction } from "@/domain/workspace/hooks/workspace-actions";
import {
  GroupTreeSelector,
  LeftColumn,
  RightColumn,
  SectionHeader,
  SelectedMemberList,
  TwoColumnLayout,
} from "@/shared/components/group-member-selector";
import { useGroupTreeSearchState } from "@/shared/components/group-member-selector/hooks/use-group-tree-search-state";
import { useMemberSelection } from "@/shared/components/group-member-selector/hooks/use-member-selection";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import type { MemberSelectionPayload } from "@/shared/types/member-selection.type";

export type AddWorkspaceMemberPayload = MemberSelectionPayload;

export function AddWorkspaceMemberModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openAddWorkspaceMemberModalAtom,
  );

  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const { resetAll } = useMemberListReset();

  const [initialAccounts, setInitialAccounts] = useState<GroupMemberResponse[]>(
    [],
  );

  // 멤버 선택 상태 관리
  const {
    selectedAccounts,
    selectedGroups,
    isFlatteningMembers,
    toggleMember,
    removeMember,
    flattenMembers,
    reset,
  } = useMemberSelection({ initialMembers: initialAccounts });
  const searchState = useGroupTreeSearchState();
  const { resetSearchState } = searchState;

  const { mutate: addMembers, isPending } = useAddWorkspaceMembersAction({
    mutation: {
      onSuccess: () => {
        resetAll();
        resetSearchState();
        reset();
        onClose();
      },
    },
  });

  const selectedAccountIds = useMemo(
    () => new Set(selectedAccounts.map((a) => a.accountId)),
    [selectedAccounts],
  );

  const selectedGroupIds = useMemo(
    () => new Set(selectedGroups.map((g) => g.groupId)),
    [selectedGroups],
  );

  useSubscribe<AddWorkspaceMemberPayload>(
    SETTING_EVENTS.sendAddWorkspaceMember,
    (payload) => {
      const accounts: GroupMemberResponse[] = payload.selectedAccounts.map(
        (member) => ({
          accountId: member.id,
          accountName: member.name,
          email: member.email,
        }),
      );
      setInitialAccounts(accounts);
      resetSearchState();
      onOpen();
    },
  );

  const handleConfirm = () => {
    if (!selectedWorkspace?.workspaceId) return;

    const members = flattenMembers();

    const accountIds = members.map((member) => member.accountId);

    if (accountIds.length === 0) return;

    addMembers({
      workspaceId: selectedWorkspace.workspaceId,
      data: { accountId: accountIds },
    });
  };

  const handleCancel = () => {
    resetSearchState();
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      type="primary"
      title="워크스페이스 구성원 추가"
      icon={<Icon name="Plus" color="#fff" size={20} />}
      onCancel={handleCancel}
      modalWidth={580}
      showCancelButton
      cancelText="취소"
      cancelButtonProps={{ disabled: isPending }}
      okText="확인"
      onOk={handleConfirm}
      centered
      okButtonProps={{
        loading: isFlatteningMembers || isPending,
        disabled: isPending,
      }}
    >
      <TwoColumnLayout>
        <LeftColumn>
          <SectionHeader>그룹 목록</SectionHeader>
          <GroupTreeSelector
            selectedAccountIds={selectedAccountIds}
            selectedGroupIds={selectedGroupIds}
            onSelectMember={toggleMember}
            searchState={searchState}
            treeHeight={272}
          />
        </LeftColumn>
        <RightColumn>
          <SelectedMemberList
            selectedAccounts={selectedAccounts}
            selectedGroups={selectedGroups}
            onRemoveMember={removeMember}
          />
        </RightColumn>
      </TwoColumnLayout>
    </Modal>
  );
}
