"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Form,
  FormItem,
  Icon,
  Input,
  Modal,
  TextArea,
  Typography,
} from "xiilab-ui";
import type { z } from "zod";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetGroupDetail } from "@/api/generated/group/group";
import { GroupMemberTable } from "@/domain/group/components/group-member-table";
import { ManageGroupMemberModal } from "@/domain/group/components/manage-group-member-modal";
import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
} from "@/domain/group/constants/group-validation.constant";
import {
  useCreateGroupAction,
  useUpdateGroupAction,
} from "@/domain/group/hooks/group-actions";
import {
  openCreateGroupModalAtom,
  selectedItemAtom,
} from "@/domain/group/state/group.atom";
import type {
  GroupModalMode,
  OpenGroupModalPayload,
} from "@/domain/group/types/group.type";
import {
  createGroupBodyExtended,
  updateGroupBodyExtended,
} from "@/domain/group/utils/group-form.override.zod";
import { groupFormErrorMap } from "@/domain/group/utils/group-form.util";
import { isUpdatePayload } from "@/domain/group/utils/group-modal.util";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { ITEM_TYPES } from "@/shared/components/group-member-selector/types";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import type { ConfirmMemberSelectionPayload } from "@/shared/types/member-selection.type";
import { subTitleStyle } from "@/styles/mixins/text";

export function ManageGroupModal() {
  type GroupFormType = z.infer<typeof createGroupBodyExtended>;

  // 모달 상태
  const { open, onOpen, onClose } = useGlobalModal(openCreateGroupModalAtom);
  const [mode, setMode] = useState<GroupModalMode>(MODAL_MODES.CREATE);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubGroup, setIsSubGroup] = useState(false);
  const [memberTableData, setMemberTableData] = useState<GroupMemberResponse[]>(
    [],
  );

  const [selected, setSelected] = useAtom(selectedItemAtom);

  const isEditMode = mode === MODAL_MODES.UPDATE;

  const createResolver = useMemo(
    () =>
      zodResolver(createGroupBodyExtended, {
        path: [],
        async: false,
        errorMap: groupFormErrorMap,
      }),
    [],
  );
  const updateResolver = useMemo(
    () =>
      zodResolver(updateGroupBodyExtended, {
        path: [],
        async: false,
        errorMap: groupFormErrorMap,
      }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm<GroupFormType>({
    resolver: (values, context, options) => {
      return isEditMode
        ? updateResolver(values, context, options)
        : createResolver(values, context, options);
    },
    defaultValues: {
      groupName: "",
      description: "",
      accountId: [],
    },
  });

  const createGroupMutation = useCreateGroupAction();
  const updateGroupMutation = useUpdateGroupAction();
  const isPending =
    createGroupMutation.isPending || updateGroupMutation.isPending;

  // 그룹 상세 정보 (수정 모드)
  const { data: groupDetail, isFetching: isFetchingGroupDetail } =
    useGetGroupDetail(editId ?? "", {
      query: {
        enabled: Boolean(editId),
      },
    });

  // 부모 그룹 정보 (하위 그룹 생성 모드)
  const parentGroupId =
    isSubGroup && selected?.type === ITEM_TYPES.GROUP ? selected.id : undefined;
  const { data: parentGroupDetail } = useGetGroupDetail(parentGroupId ?? "", {
    query: {
      enabled: Boolean(parentGroupId) && !isEditMode,
    },
  });

  // PubSub
  const publish = usePublish();

  // biome-ignore lint/correctness/useExhaustiveDependencies: 그룹 수정/생성 모달 변경 감지
  useEffect(() => {
    if (isEditMode && groupDetail) {
      const users = groupDetail.users ?? [];
      const accountIds = users.map((user) => user.accountId);
      setMemberTableData(users);
      resetForm({
        groupName: groupDetail.groupName,
        description: groupDetail.description ?? "",
        accountId: accountIds,
      });
    }
  }, [isEditMode]);

  // PubSub 구독 - 그룹 모달 열기
  useSubscribe<OpenGroupModalPayload>(
    GROUP_EVENTS.openGroupModal,
    (payload) => {
      setMode(payload.mode);

      if (isUpdatePayload(payload)) {
        setEditId(payload.groupId);
        setIsSubGroup(false);
        setMemberTableData([]);
        resetForm({
          groupName: "",
          description: "",
          accountId: [],
        });
      } else {
        resetForm({
          groupName: "",
          description: "",
          accountId: [],
        });
        setMemberTableData([]);
        setEditId(null);
        setIsSubGroup(payload.isSubGroup ?? false);
      }

      onOpen();
    },
  );

  // PubSub 구독 - 멤버 선택 확인
  useSubscribe<ConfirmMemberSelectionPayload>(
    GROUP_EVENTS.confirmMemberSelection,
    (payload) => {
      const accountIds = payload.members.map((member) => member.accountId);
      setMemberTableData(payload.members);
      setValue("accountId", accountIds, { shouldValidate: true });
    },
  );

  // 모달 닫기
  const handleClose = () => {
    if (isPending) return;
    resetForm({
      groupName: "",
      description: "",
      accountId: [],
    });
    setMemberTableData([]);
    setMode(MODAL_MODES.CREATE);
    setEditId(null);
    setIsSubGroup(false);
    onClose();
  };

  // 폼 제출
  const onSubmit = (data: GroupFormType) => {
    const accountIds = memberTableData.map((member) => member.accountId);

    if (isEditMode) {
      if (!editId) return;

      updateGroupMutation.mutate(
        {
          groupId: editId,
          data: {
            groupName: data.groupName,
            description: data.description,
            accountId: accountIds,
          },
        },
        {
          onSuccess: () => {
            // detail-panel을 강제로 리렌더하기 위해 selected atom 리셋 후 복원
            if (selected?.type === ITEM_TYPES.GROUP) {
              const groupId = selected.id;
              setSelected(null);
              setSelected({ id: groupId, type: ITEM_TYPES.GROUP });
            }

            handleClose();
          },
        },
      );
      return;
    }

    // 생성 모드: 하위 그룹 추가 시에만 parentGroupId 사용
    createGroupMutation.mutate(
      {
        data: {
          groupName: data.groupName,
          description: data.description,
          parentGroupId,
          accountId: accountIds,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  // 멤버 추가 버튼 클릭
  const handleAddMember = () => {
    publish(GROUP_EVENTS.openMemberModal, {
      selectedAccounts: memberTableData.map((m) => ({
        id: m.accountId,
        name: m.accountName,
        email: m.email,
        type: ITEM_TYPES.ACCOUNT,
      })),
    });
  };

  const handleRemoveMember = (accountId: string) => {
    const next = memberTableData.filter(
      (member) => member.accountId !== accountId,
    );
    setMemberTableData(next);
    setValue(
      "accountId",
      next.map((member) => member.accountId),
      { shouldValidate: true },
    );
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
        closable={!isPending}
        title={isEditMode ? "그룹 정보 수정" : "그룹 추가"}
        showCancelButton
        cancelText="취소"
        onCancel={handleClose}
        okText={isEditMode ? "수정" : "추가"}
        onOk={handleSubmit(onSubmit)}
        centered
        showHeaderBorder
        maskClosable={!isPending}
        keyboard={!isPending}
        cancelButtonProps={{ disabled: isPending }}
        okButtonProps={{
          loading: isPending,
          disabled: isPending || (isEditMode && isFetchingGroupDetail),
        }}
      >
        <Form layout="vertical">
          {parentGroupDetail && (
            <>
              <SubTitle>상위 그룹 정보</SubTitle>
              <DetailCard>
                <ParentGroupInfo>
                  <ParentGroupLabel>선택한 그룹</ParentGroupLabel>
                  <ParentGroupValue>
                    {parentGroupDetail.groupName}
                  </ParentGroupValue>
                </ParentGroupInfo>
              </DetailCard>
              <SubTitle>그룹 정보</SubTitle>
            </>
          )}

          <Controller
            name="groupName"
            control={control}
            render={({ field }) => (
              <FormItem
                label="이름"
                required
                htmlFor="group-name"
                help={errors.groupName?.message}
                validateStatus={errors.groupName ? "error" : undefined}
              >
                <Input
                  id="group-name"
                  type="text"
                  placeholder="그룹 이름을 입력해 주세요."
                  width="100%"
                  value={field.value}
                  onChange={field.onChange}
                  status={errors.groupName ? "error" : undefined}
                  disabled={isPending}
                  maxLength={GROUP_NAME_MAX_LENGTH}
                />
              </FormItem>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormItem
                label="설명"
                htmlFor="group-description"
                help={errors.description?.message}
                validateStatus={errors.description ? "error" : undefined}
              >
                <TextArea
                  {...field}
                  id="group-description"
                  placeholder="그룹 설명을 입력해 주세요."
                  maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
                  disabled={isPending}
                  resize="none"
                  height="74px"
                />
              </FormItem>
            )}
          />

          <FormItem
            label="멤버"
            help={errors.accountId?.message}
            validateStatus={errors.accountId ? "error" : undefined}
          >
            <MemberSection>
              <MemberButtonWrapper>
                <CreateModelButton
                  onClick={handleAddMember}
                  title="멤버 추가"
                />
              </MemberButtonWrapper>
              <MemberTableWrapper>
                <GroupMemberTable
                  data={memberTableData}
                  onRemove={handleRemoveMember}
                />
              </MemberTableWrapper>
            </MemberSection>
          </FormItem>
        </Form>
      </StyledModal>

      <ManageGroupMemberModal />
    </>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    max-height: 500px;
    overflow-y: auto;
  }
`;

const MemberSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MemberTableWrapper = styled.div`
  height: 152px;
`;

const MemberButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  top: -24px;
`;

const SubTitle = styled.div`
  ${subTitleStyle(6)}
  margin-left: 6px;
  margin-bottom: 8px;
`;

const DetailCard = styled.div`
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
  margin-bottom: 16px;
`;

const ParentGroupInfo = styled.div`
  display: flex;
`;

const ParentGroupLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  min-width: 82px;
  margin-right: 24px;
`;

const ParentGroupValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
`;
