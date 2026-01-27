"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import {
  getGetNotificationSetsQueryKey,
  useGetNotificationSets,
  useUpdateNotificationSet,
} from "@/api/generated/account-notification/account-notification";
import type {
  NotificationSetResponse,
  NotificationSetUpdateRequest,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NotificationSetResponseNotificationType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NotificationSettingSection } from "@/domain/setting/components/notification-setting/notification-setting-section";
import { openUpdateNotificationSettingModalAtom } from "@/domain/setting/state/setting.atom";
import { groupNotificationSetsBySection } from "@/domain/setting/utils/notification-setting.util";
import {
  type NotificationChannel,
  USER_NOTIFICATION_SECTION_ORDER,
} from "@/shared/constants/notification";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";

const WORKSPACE_SECTION_TITLE = "워크스페이스";
const WORKLOAD_SECTION_TITLE = "워크로드";

export function UpdateNotificationSettingModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateNotificationSettingModalAtom,
  );
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";
  const workspaceId = selectedWorkspace?.workspaceId ?? 0;

  const { data: notificationSets, isLoading } = useGetNotificationSets(
    accountId,
    workspaceId,
    {
      query: {
        enabled: open && Boolean(accountId) && Boolean(workspaceId),
      },
    },
  );

  const { mutate: updateNotificationSet } = useUpdateNotificationSet({
    mutation: {
      onMutate: async (variables) => {
        const queryKey = getGetNotificationSetsQueryKey(accountId, workspaceId);

        await queryClient.cancelQueries({ queryKey });

        const previousData =
          queryClient.getQueryData<NotificationSetResponse[]>(queryKey);

        queryClient.setQueryData<NotificationSetResponse[]>(queryKey, (old) =>
          old?.map((item) =>
            item.notificationSetId === variables.notificationSetId
              ? {
                  ...item,
                  isSystemNotificationEnabled:
                    variables.data.hasSystemNotificationEnabled,
                  isEmailNotificationEnabled:
                    variables.data.hasEmailNotificationEnabled,
                }
              : item,
          ),
        );

        return { previousData };
      },
      onError: (_error, _variables, context) => {
        // 에러 시 롤백
        if (context?.previousData) {
          queryClient.setQueryData(
            getGetNotificationSetsQueryKey(accountId, workspaceId),
            context.previousData,
          );
        }
      },
    },
  });

  const handleSwitchChange = (
    notificationSet: NotificationSetResponse,
    channel: NotificationChannel,
    checked: boolean,
  ) => {
    if (!accountId || !workspaceId) return;

    const requestData: NotificationSetUpdateRequest = {
      hasSystemNotificationEnabled:
        channel === "SYSTEM"
          ? checked
          : notificationSet.isSystemNotificationEnabled,
      hasEmailNotificationEnabled:
        channel === "EMAIL"
          ? checked
          : notificationSet.isEmailNotificationEnabled,
    };

    updateNotificationSet({
      accountId,
      workspaceId,
      notificationSetId: notificationSet.notificationSetId,
      data: requestData,
    });
  };

  const groupedNotificationSets = groupNotificationSetsBySection(
    notificationSets ?? [],
  );

  const isSwitchDisabled = !accountId || !workspaceId || isLoading;

  useSubscribe(SETTING_EVENTS.sendUpdateNotificationSetting, () => {
    onOpen();
  });

  return (
    <InfoModal
      modalWidth={600}
      title="알림 설정"
      icon={<Icon name="Noti" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      centered
    >
      <ModalContent>
        {USER_NOTIFICATION_SECTION_ORDER.map((section) => {
          const sectionItems = groupedNotificationSets.get(section) ?? [];
          const title =
            section === NotificationSetResponseNotificationType.WORKSPACE
              ? WORKSPACE_SECTION_TITLE
              : WORKLOAD_SECTION_TITLE;

          return (
            <NotificationSettingSection
              key={section}
              title={title}
              section={section}
              items={sectionItems}
              isSwitchDisabled={isSwitchDisabled}
              isLoading={isLoading}
              onToggle={handleSwitchChange}
            />
          );
        })}
      </ModalContent>
    </InfoModal>
  );
}

const ModalContent = styled.div`
  padding: 0;
  height: auto;
  overflow: visible;
`;
