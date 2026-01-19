"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Dropdown, Form, FormItem, Icon, Modal, Typography } from "xiilab-ui";
import type { z } from "zod";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { updateMemberRoleBody } from "@/api/generated/workspace-member/workspace-member.zod";
import { openUpdateWorkspaceMemberRoleModalAtom } from "@/domain/setting/state/setting.atom";
import { WORKSPACE_MEMBER_ROLE_OPTIONS } from "@/domain/workspace/constants/workspace.constant";
import { useUpdateMemberRoleAction } from "@/domain/workspace/hooks/workspace-actions";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { subTitleStyle } from "@/styles/mixins/text";

type UpdateMemberRoleFormType = z.infer<typeof updateMemberRoleBody>;

export function UpdateWorkspaceMemberRoleModal() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId ?? null;

  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateWorkspaceMemberRoleModalAtom,
  );

  const selectedMemberRef = useRef<WorkspaceMemberResponse | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMemberRoleFormType>({
    resolver: zodResolver(updateMemberRoleBody),
    defaultValues: {
      memberRole: undefined,
    },
  });

  const updateMemberRoleMutation = useUpdateMemberRoleAction();
  const isPending = updateMemberRoleMutation.isPending;

  useSubscribe<WorkspaceMemberResponse>(
    SETTING_EVENTS.sendUpdateWorkspaceMemberRole,
    (payload) => {
      selectedMemberRef.current = payload;
      reset({ memberRole: payload.memberRole });
      onOpen();
    },
  );

  const handleClose = () => {
    if (isPending) return;
    selectedMemberRef.current = null;
    reset({ memberRole: undefined });
    onClose();
  };

  const onSubmit = (formData: UpdateMemberRoleFormType) => {
    if (!workspaceId) {
      toast.error("워크스페이스가 선택되지 않았습니다.");
      return;
    }
    const selectedMember = selectedMemberRef.current;
    if (!selectedMember) {
      toast.error("수정할 구성원을 선택해 주세요.");
      return;
    }

    updateMemberRoleMutation.mutate(
      { workspaceId, accountId: selectedMember.accountId, data: formData },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const selectedMember = selectedMemberRef.current;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      title="권한 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="확인"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled: isPending,
        loading: isPending,
      }}
    >
      <Container>
        <Subject>계정 상세 정보</Subject>
        <InfoList>
          <InfoRow>
            <Typography.Text variant="body-2-2" color="#484848">
              이름
            </Typography.Text>
            <Typography.Text variant="subtitle-2-3" color="#000">
              {selectedMember?.accountName ?? "-"}
            </Typography.Text>
          </InfoRow>
          <InfoRow>
            <Typography.Text variant="body-2-2" color="#484848">
              이메일
            </Typography.Text>
            <Typography.Text variant="subtitle-2-3" color="#000">
              {selectedMember?.email ?? "-"}
            </Typography.Text>
          </InfoRow>
        </InfoList>

        <Subject>정보 수정</Subject>
        <StyledForm layout="vertical">
          <Controller
            name="memberRole"
            control={control}
            render={({ field }) => (
              <StyledFormItem
                label="권한"
                required
                help={errors.memberRole?.message}
                validateStatus={errors.memberRole ? "error" : undefined}
              >
                <Dropdown
                  options={[...WORKSPACE_MEMBER_ROLE_OPTIONS]}
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                  width="100%"
                  placeholder="권한을 선택해 주세요."
                  disabled={isPending}
                  status={errors.memberRole ? "error" : undefined}
                />
              </StyledFormItem>
            )}
          />
        </StyledForm>
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Subject = styled(Typography.Text).attrs({
  variant: "body-2-1",
})`
  ${subTitleStyle(0)}

  color: #000;
  padding-left: 4px;
  margin-bottom: 5px;
  width: 100%;
`;

const StyledForm = styled(Form)`
  width: 100%;
`;

const StyledFormItem = styled(FormItem)`
  && {
    margin-bottom: 0;
  }
`;

const InfoList = styled.div`
  width: 100%;
  border: 1px solid #E9E9E9;
  border-radius: 2px;
  padding: 16px;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 8px;
  padding: 4px 0;
`;
