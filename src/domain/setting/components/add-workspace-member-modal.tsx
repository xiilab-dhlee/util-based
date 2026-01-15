"use client";

import { useMemo, useState } from "react";
import { Modal } from "xiilab-ui";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { openAddWorkspaceMemberModalAtom } from "@/domain/setting/state/setting.atom";
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
import type { MemberSelectionPayload } from "@/shared/types/member-selection.type";

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

  // 선택된 ID 목록 (Set 형태로 변환)
  const selectedAccountIds = useMemo(
    () => new Set(selectedAccounts.map((a) => a.accountId)),
    [selectedAccounts],
  );

  const selectedGroupIds = useMemo(
    () => new Set(selectedGroups.map((g) => g.groupId)),
    [selectedGroups],
  );

  // PubSub 구독 - 멤버 모달 열기 이벤트
  useSubscribe<AddWorkspaceMemberPayload>(
    SETTING_EVENTS.sendAddWorkspaceMember,
    (payload) => {
      // SelectedMember 타입을 GroupMemberResponse로 변환
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

  const handleConfirm = async () => {
    // 평탄화 수행
    const _flattenedMembers = await flattenMembers();

    // GroupMemberResponse는 이미 DisplayMember와 호환되는 구조 (accountId, accountName, email)
    // TODO: 구성원 추가 API 호출 - _flattenedMembers 사용

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
      title="워크스페이스 구성원 추가"
      onCancel={handleCancel}
      modalWidth={700}
      showCancelButton
      cancelText="취소"
      okText="확인"
      onOk={handleConfirm}
      okButtonProps={{
        loading: isFlatteningMembers,
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
