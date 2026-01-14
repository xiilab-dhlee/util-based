"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import { useGetGroupDetail } from "@/api/generated/group/group";
import { GroupMemberTable } from "@/domain/group/components/group-member-table";
import { ManageGroupMemberModal } from "@/domain/group/components/manage-group-member-modal";
import { useGroupForm } from "@/domain/group/hooks/use-group-form";
import { openCreateGroupModalAtom } from "@/domain/group/state/group.atom";
import type {
  GroupModalMode,
  OpenGroupModalPayload,
} from "@/domain/group/types/group.type";
import { isUpdatePayload } from "@/domain/group/utils/group-modal.util";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { ITEM_TYPES } from "@/shared/components/group-member-selector/types";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import type { ConfirmMemberSelectionPayload } from "@/shared/types/member-selection.type";

/**
 * 그룹 생성/수정 모달
 *
 * @description
 * - 그룹 이름, 설명, 멤버를 입력받는 폼 제공
 * - 생성/수정 모드 지원 (PubSub으로 모드 전환)
 * - 멤버 추가 시 별도 모달(ManageGroupMemberModal) 호출
 */
export function ManageGroupModal() {
  // 모달 상태
  const { open, onOpen, onClose } = useGlobalModal(openCreateGroupModalAtom);
  const [mode, setMode] = useState<GroupModalMode>(MODAL_MODES.CREATE);
  const [editId, setEditId] = useState<string | null>(null);

  const isEditMode = mode === MODAL_MODES.UPDATE;

  // 폼 상태 (멤버 테이블 데이터 포함)
  const form = useGroupForm();

  // 그룹 상세 정보 (수정 모드)
  const { data: groupDetail } = useGetGroupDetail(editId ?? "");

  // PubSub
  const publish = usePublish();

  // 그룹 상세 정보 로드 시 폼 초기화 (수정 모드)
  useEffect(() => {
    if (isEditMode && groupDetail) {
      form.initializeForEdit(groupDetail);
    }
  }, [isEditMode, groupDetail, form.initializeForEdit]);

  // PubSub 구독 - 그룹 모달 열기
  useSubscribe<OpenGroupModalPayload>(
    GROUP_EVENTS.openGroupModal,
    (payload) => {
      setMode(payload.mode);

      if (isUpdatePayload(payload)) {
        setEditId(payload.groupId);
      } else {
        form.initializeForCreate();
        setEditId(null);
      }

      onOpen();
    },
  );

  // PubSub 구독 - 멤버 선택 확인
  useSubscribe<ConfirmMemberSelectionPayload>(
    GROUP_EVENTS.confirmMemberSelection,
    (payload) => {
      form.setMemberTableData(payload.members);
    },
  );

  // 모달 닫기
  const handleClose = () => {
    form.reset();
    setMode(MODAL_MODES.CREATE);
    setEditId(null);
    onClose();
  };

  // 폼 제출
  const handleSubmit = () => {
    const payload = form.validate();
    if (!payload) return;

    toast.success(
      isEditMode ? "그룹이 수정되었습니다." : "그룹이 추가되었습니다.",
    );
    handleClose();
  };

  // 멤버 추가 버튼 클릭
  const handleAddMember = () => {
    publish(GROUP_EVENTS.openMemberModal, {
      selectedAccounts: form.memberTableData.map((m) => ({
        id: m.accountId,
        name: m.accountName,
        email: m.email,
        type: ITEM_TYPES.ACCOUNT,
      })),
    });
  };

  return (
    <>
      <StyledModal
        type="primary"
        icon={
          <Icon name={isEditMode ? "Edit01" : "Plus"} color="#fff" size={18} />
        }
        modalWidth={370}
        open={open}
        closable
        title={isEditMode ? "그룹 정보 수정" : "그룹 추가"}
        showCancelButton
        cancelText="취소"
        onCancel={handleClose}
        okText={isEditMode ? "수정" : "추가"}
        onOk={handleSubmit}
        centered
        showHeaderBorder
      >
        <Form layout="vertical">
          <FormItem label="이름" required>
            <Input
              type="text"
              placeholder="그룹 이름을 입력해 주세요."
              width="100%"
              value={form.formState.name}
              onChange={(e) => form.setField("name", e.target.value)}
              status={form.errors.name ? "error" : undefined}
            />
          </FormItem>

          <FormItem label="설명">
            <StyledTextArea
              placeholder="그룹 설명을 입력해 주세요."
              value={form.formState.description}
              onChange={(e) => form.setField("description", e.target.value)}
            />
          </FormItem>

          <FormItem label="멤버">
            <MemberSection>
              <MemberButtonWrapper>
                <CreateModelButton
                  onClick={handleAddMember}
                  title="멤버 추가"
                />
              </MemberButtonWrapper>
              <GroupMemberTable
                data={form.memberTableData}
                onRemove={form.removeMember}
              />
            </MemberSection>
          </FormItem>
        </Form>
      </StyledModal>

      <ManageGroupMemberModal />
    </>
  );
}

// ===== Styled Components =====

const StyledModal = styled(Modal)`
  .ant-modal-body {
    max-height: 500px;
    overflow-y: auto;
  }
`;

const StyledTextArea = styled(TextArea)`
  && {
    height: 74px;
    min-height: 74px;
  }
`;

const MemberSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MemberButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  top: -24px;
`;
