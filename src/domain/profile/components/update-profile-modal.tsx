"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import { useGetProfile } from "@/api/generated/account-profile/account-profile";
import { UPDATE_PROFILE_FORM_CONSTANTS } from "@/domain/profile/constants/update-profile-form.constant";
import { useUpdateProfileAction } from "@/domain/profile/hooks/profile-actions";
import {
  type UpdateProfileFormType,
  updateProfileSchema,
} from "@/domain/profile/utils/update-profile-form.zod";
import { LoggedInUserCard } from "@/shared/components/card/logged-in-user-card";
import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openUpdateProfileModalAtom } from "@/shared/state/modal.atom";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { subTitleStyle } from "@/styles/mixins/text";

/**
 * 회원정보 수정 모달 컴포넌트
 */
export function UpdateProfileModal() {
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const { open, onOpen, onClose } = useGlobalModal(openUpdateProfileModalAtom);

  const { data: profile } = useGetProfile(accountId, {
    query: { enabled: Boolean(accountId) && open },
  });

  const { mutate: updateProfile, isPending } = useUpdateProfileAction();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // profile 로딩 시 defaultValues 업데이트
  useEffect(() => {
    if (profile && open) {
      const firstName = profile.firstName || "";
      const lastName = profile.lastName || "";

      reset({
        firstName,
        lastName,
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, open, reset]);

  const onSubmit = (data: UpdateProfileFormType) => {
    if (isPending) return;

    updateProfile(
      {
        accountId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          ...(data.newPassword && { newPassword: data.newPassword }),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useSubscribe(COMMON_EVENTS.sendUpdateProfile, () => {
    reset();
    onOpen();
  });

  const groupNames = profile?.groupName ?? [];
  const groupNamesText = groupNames.length > 0 ? groupNames.join("\n") : "-";

  const workspaceCountText = formatNumberWithUnit(
    profile?.workspaceCount,
    "개",
  );
  const workspaceLimitCountText = formatNumberWithUnit(
    profile?.workspaceLimitCount,
    "개",
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="회원정보 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="수정 완료"
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{ disabled: isPending }}
      centered
      showHeaderBorder
    >
      <ProfileSectionList>
        <ProfileInfoWrapper>
          <SectionTitle>회원 상세 정보</SectionTitle>
          <LoggedInUserCard
            username={profile?.accountName ?? "-"}
            email={profile?.email ?? "-"}
          />
          <InfoSection>
            <InfoLabel>그룹 이름</InfoLabel>
            <GroupNamesValue>{groupNamesText}</GroupNamesValue>
          </InfoSection>
          <InfoSection>
            <InfoLabel>워크스페이스 보유 현황</InfoLabel>
            <InfoValue>
              {workspaceCountText}/{workspaceLimitCountText}
            </InfoValue>
          </InfoSection>
        </ProfileInfoWrapper>
        <div>
          <SectionTitle>정보 수정</SectionTitle>
          <Form layout="vertical">
            <NameRow>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <FormItem
                    label="First Name"
                    help={errors.firstName?.message}
                    validateStatus={errors.firstName ? "error" : undefined}
                  >
                    <Input
                      {...field}
                      type="text"
                      id="update-first-name"
                      placeholder="이름을 입력해 주세요."
                      width="100%"
                      maxLength={
                        UPDATE_PROFILE_FORM_CONSTANTS.firstName.maxLength
                      }
                      autoComplete="off"
                      status={errors.firstName ? "error" : undefined}
                    />
                  </FormItem>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <FormItem
                    label="Last Name"
                    help={errors.lastName?.message}
                    validateStatus={errors.lastName ? "error" : undefined}
                  >
                    <Input
                      {...field}
                      type="text"
                      id="update-last-name"
                      placeholder="성을 입력해 주세요."
                      width="100%"
                      maxLength={
                        UPDATE_PROFILE_FORM_CONSTANTS.lastName.maxLength
                      }
                      autoComplete="off"
                      status={errors.lastName ? "error" : undefined}
                    />
                  </FormItem>
                )}
              />
            </NameRow>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="신규 비밀번호"
                  help={errors.newPassword?.message}
                  validateStatus={errors.newPassword ? "error" : undefined}
                >
                  <Input
                    {...field}
                    type="password"
                    id="update-new-password"
                    placeholder={`비밀번호(영문, 숫자, 특수문자 포함 ${UPDATE_PROFILE_FORM_CONSTANTS.password.minLength}~${UPDATE_PROFILE_FORM_CONSTANTS.password.maxLength}자)`}
                    width="100%"
                    maxLength={UPDATE_PROFILE_FORM_CONSTANTS.password.maxLength}
                    autoComplete="new-password"
                    status={errors.newPassword ? "error" : undefined}
                  />
                </FormItem>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <LastFormItem
                  label="신규 비밀번호 확인"
                  help={errors.confirmPassword?.message}
                  validateStatus={errors.confirmPassword ? "error" : undefined}
                >
                  <Input
                    {...field}
                    type="password"
                    id="update-confirm-password"
                    placeholder="비밀번호를 한번 더 입력해 주세요."
                    width="100%"
                    maxLength={UPDATE_PROFILE_FORM_CONSTANTS.password.maxLength}
                    autoComplete="new-password"
                    status={errors.confirmPassword ? "error" : undefined}
                  />
                </LastFormItem>
              )}
            />
          </Form>
        </div>
      </ProfileSectionList>
    </Modal>
  );
}

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-2-1",
})`
  ${subTitleStyle(6)}
  margin-left: 6px;
`;

const InfoSection = styled.div`
  border : 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 16px;

`;

const ProfileSectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  margin-bottom: 10px;
`;

const InfoValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #191b26;
`;

const GroupNamesValue = styled(InfoValue)`
  display: block;
  max-height: 60px;
  overflow-y: auto;
  white-space: pre-line;
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const LastFormItem = styled(FormItem)`
  && {
    margin-bottom: 0;
  }
`;
