"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import { ManageGroupMemberModal } from "@/domain/group/components/manage-group-member-modal";
import { useGetAllGroups } from "@/domain/group/hooks/use-get-all-groups";
import { useGetGroupDetail } from "@/domain/group/hooks/use-get-group-detail";
import { useGroupForm } from "@/domain/group/hooks/use-group-form";
import { openCreateGroupModalAtom } from "@/domain/group/state/group.atom";
import type {
  GroupModalMode,
  OpenGroupModalPayload,
  OpenMemberModalPayload,
  SelectedMember,
} from "@/domain/group/types/group.type";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  GROUP_TREE_NODE_TYPE,
  type GroupTreeType,
} from "@/shared/schemas/group-tree.schema";
import {
  extractAccountsFromGroup,
  findNodeById,
} from "@/shared/utils/group-tree.util";

/**
 * 그룹 생성/수정 모달
 */
export function ManageGroupModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openCreateGroupModalAtom);

  // 모달 모드 상태
  const [mode, setMode] = useState<GroupModalMode>(MODAL_MODES.CREATE);
  const isEditMode = mode === MODAL_MODES.UPDATE;

  // 수정 모드에서 그룹 ID 저장
  const [editId, setEditId] = useState<string | null>(null);

  // 선택된 멤버 상태
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedMember[]>(
    [],
  );
  const [selectedGroups, setSelectedGroups] = useState<SelectedMember[]>([]);

  // 그룹 트리 데이터 (선택된 그룹의 하위 계정 추출용)
  const { data: allGroupsData } = useGetAllGroups();
  const treeData = allGroupsData?.content ?? [];

  // 그룹 상세 정보 조회 (수정 모드에서만 활성화)
  const { data: groupDetail } = useGetGroupDetail(editId ?? "");

  // PubSub
  const publish = usePublish();

  // 폼 훅 사용 (순수 폼 상태 + 검증만)
  const form = useGroupForm();

  // Mutations
  // const createGroup = useCreateGroup();
  // const updateGroup = useUpdateGroup();

  // const isSubmitting = createGroup.isPending || updateGroup.isPending;
  const isSubmitting = false;

  // 그룹 상세 정보가 로드되면 멤버 초기화 (수정 모드)
  useEffect(() => {
    if (isEditMode && groupDetail?.users) {
      const accounts: SelectedMember[] = groupDetail.users.map((user) => ({
        id: user.accountId,
        name: user.accountName,
        email: user.email,
        type: GROUP_TREE_NODE_TYPE.account,
      }));
      setSelectedAccounts(accounts);
      // 폼에 멤버 ID 반영
      form.setMembers(accounts.map((a) => a.id));
    }
  }, [isEditMode, groupDetail, form]);

  // PubSub 구독 - 생성/수정 모드 초기화
  useSubscribe<OpenGroupModalPayload>(
    GROUP_EVENTS.openGroupModal,
    (payload) => {
      setMode(payload.mode);
      if (payload.mode === MODAL_MODES.UPDATE && payload.data) {
        form.initializeForEdit(payload.data);
        // 수정 모드: 그룹 ID 설정하여 상세 정보 조회 트리거
        setEditId(payload.data.id);
        // 그룹 상세 로드 전까지 빈 배열로 초기화 (useEffect에서 업데이트됨)
        setSelectedAccounts([]);
        setSelectedGroups([]);
      } else {
        form.initializeForCreate();
        setEditId(null);
        setSelectedAccounts([]);
        setSelectedGroups([]);
      }
      onOpen();
    },
  );

  // PubSub 구독 - 멤버 선택 확인 이벤트
  useSubscribe<OpenMemberModalPayload>(
    GROUP_EVENTS.confirmMemberSelection,
    (payload) => {
      setSelectedAccounts(payload.selectedAccounts);
      setSelectedGroups(payload.selectedGroups);

      // 개별 계정 ID
      const accountIds = payload.selectedAccounts.map((a) => a.id);

      // 선택된 그룹의 하위 계정 ID
      const groupAccountIds = payload.selectedGroups
        .map((group) => findNodeById(treeData, group.id))
        .filter((node): node is GroupTreeType => node !== null)
        .flatMap((node) => extractAccountsFromGroup(node).map((a) => a.id));

      // 폼에 멤버 ID 반영 (중복 제거)
      form.setMembers([...new Set([...accountIds, ...groupAccountIds])]);
    },
  );

  // 모달 닫기 시 폼 및 mutation 리셋
  const handleClose = () => {
    form.reset();
    setMode(MODAL_MODES.CREATE);
    setEditId(null);
    setSelectedAccounts([]);
    setSelectedGroups([]);
    // createGroup.reset();
    // updateGroup.reset();
    onClose();
  };

  // 폼 제출
  const handleSubmit = () => {
    // 1. 검증
    const payload = form.validate();
    if (!payload) return;

    // 2. API 호출
    const onSuccess = () => {
      toast.success(
        isEditMode ? "그룹이 수정되었습니다." : "그룹이 추가되었습니다.",
      );
      handleClose();
    };

    // TODO: API 연동 시 주석 해제
    // if (isEditMode && editId) {
    //   updateGroup.mutate({ id: editId, ...payload }, { onSuccess });
    // } else {
    //   createGroup.mutate(payload, { onSuccess });
    // }

    // 임시: API 연동 전까지 바로 성공 처리
    onSuccess();
  };

  // 멤버 추가 버튼 클릭 - PubSub으로 멤버 모달 열기
  const handleAddMember = () => {
    publish(GROUP_EVENTS.openMemberModal, {
      selectedAccounts,
      selectedGroups,
    } as OpenMemberModalPayload);
  };

  // 선택된 멤버 총 수
  const totalMembers = selectedAccounts.length + selectedGroups.length;

  return (
    <div>
      <Modal
        type="primary"
        icon={
          <Icon name={isEditMode ? "Edit01" : "Plus"} color="#fff" size={18} />
        }
        modalWidth={370}
        open={open}
        closable
        title={isEditMode ? "그룹 수정" : "그룹 추가"}
        showCancelButton
        cancelText="취소"
        onCancel={handleClose}
        okText={isEditMode ? "수정" : "추가"}
        onOk={handleSubmit}
        centered
        showHeaderBorder
        okButtonProps={{
          loading: isSubmitting,
        }}
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
            <TextArea
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
              {totalMembers > 0 && (
                <MemberSummary>
                  {selectedAccounts.length > 0 && (
                    <div>
                      계정 {selectedAccounts.length}명:{" "}
                      {selectedAccounts
                        .map((account) =>
                          account.email
                            ? `${account.name}(${account.email})`
                            : account.name,
                        )
                        .join(", ")}
                    </div>
                  )}
                  {selectedGroups.length > 0 && (
                    <div>
                      그룹 {selectedGroups.length}개:{" "}
                      {selectedGroups.map((group) => group.name).join(", ")}
                    </div>
                  )}
                </MemberSummary>
              )}
            </MemberSection>
          </FormItem>
        </Form>
      </Modal>

      <ManageGroupMemberModal />
    </div>
  );
}

// ===== Styled Components =====

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

const MemberSummary = styled.div`
  font-size: 12px;
  color: #666;
`;
