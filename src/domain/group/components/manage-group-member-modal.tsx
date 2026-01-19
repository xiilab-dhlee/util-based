"use client";

import { useMemo, useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { openMemberModalAtom } from "@/domain/group/state/group.atom";
import type { OpenMemberModalPayload } from "@/domain/group/types/group.type";
import {
  GroupTreeSelector,
  LeftColumn,
  RightColumn,
  SectionHeader,
  SelectedMemberList,
  TwoColumnLayout,
  useGroupTreeLoader,
} from "@/shared/components/group-member-selector";
import { useGroupTreeSearchState } from "@/shared/components/group-member-selector/hooks/use-group-tree-search-state";
import { useMemberSelection } from "@/shared/components/group-member-selector/hooks/use-member-selection";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";

export function ManageGroupMemberModal() {
  const { open, onOpen, onClose } = useGlobalModal(openMemberModalAtom);
  const publish = usePublish();

  const [initialAccounts, setInitialAccounts] = useState<GroupMemberResponse[]>(
    [],
  );

  const treeLoader = useGroupTreeLoader();
  const { resetTree } = treeLoader;

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

  const selectedAccountIds = useMemo(
    () => new Set(selectedAccounts.map((a) => a.accountId)),
    [selectedAccounts],
  );

  const selectedGroupIds = useMemo(
    () => new Set(selectedGroups.map((g) => g.groupId)),
    [selectedGroups],
  );

  useSubscribe<OpenMemberModalPayload>(
    GROUP_EVENTS.openMemberModal,
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
      resetTree();
      onOpen();
    },
  );

  const handleConfirm = () => {
    const flattenedMembers = flattenMembers();

    publish(GROUP_EVENTS.confirmMemberSelection, {
      members: flattenedMembers,
    });

    resetSearchState();
    reset();
    onClose();
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
      title="멤버 추가"
      onCancel={handleCancel}
      modalWidth={580}
      showCancelButton
      cancelText="취소"
      okText="확인"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      onOk={handleConfirm}
      okButtonProps={{
        loading: isFlatteningMembers,
      }}
      centered
    >
      {open && (
        <TwoColumnLayout>
          <LeftColumn>
            <SectionHeader>그룹 목록</SectionHeader>
            <GroupTreeSelector
              selectedAccountIds={selectedAccountIds}
              selectedGroupIds={selectedGroupIds}
              onSelectMember={toggleMember}
              searchState={searchState}
              treeHeight={272}
              treeLoader={treeLoader}
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
      )}
    </Modal>
  );
}
