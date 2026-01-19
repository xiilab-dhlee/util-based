"use client";

import { useCallback, useMemo, useState } from "react";
import { Modal } from "xiilab-ui";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { openReportReservationMemberModalAtom } from "@/domain/report/state/report.atom";
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
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import type { SelectedMember } from "@/shared/types/member-selection.type";

/** 리포트 예약 멤버 모달 열기 페이로드 */
export interface OpenReportReservationMemberModalPayload {
  selectedAccounts: SelectedMember[];
}

/** 리포트 예약 멤버 선택 확인 페이로드 */
export interface ConfirmReportReservationMemberSelectionPayload {
  members: GroupMemberResponse[];
}

/**
 * 리포트 예약 멤버 추가 모달
 *
 * PubSub 패턴을 사용하여 ReportReservationModal과 상태를 공유합니다.
 */
export function ReportReservationMemberModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openReportReservationMemberModalAtom,
  );
  const publish = usePublish();

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

  const handleOpenMemberModal = useCallback(
    (payload: OpenReportReservationMemberModalPayload) => {
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
    [onOpen, resetSearchState],
  );

  useSubscribe<OpenReportReservationMemberModalPayload>(
    RESERVATION_EVENTS.openMemberModal,
    handleOpenMemberModal,
  );

  const handleConfirm = async () => {
    // 평탄화 수행
    const flattenedMembers = await flattenMembers();

    // GroupMemberResponse는 이미 DisplayMember와 호환되는 구조 (accountId, accountName, email)
    publish(RESERVATION_EVENTS.confirmMemberSelection, {
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
      title="멤버 추가"
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
