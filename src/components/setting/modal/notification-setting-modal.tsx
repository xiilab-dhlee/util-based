"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { Box, Icon, Modal, Switch } from "xiilab-ui";

import {
  closeNotificationSettingModalAtom,
  type NotificationSetting,
  type NotificationSettings,
  notificationSettingModalOpenAtom,
  notificationSettingsAtom,
} from "@/atoms/setting/setting-modal.atom";
import { EmptyState } from "@/components/common/empty-state/empty-state";

/**
 * 알림설정 모달 컴포넌트
 *
 * 워크스페이스의 알림 설정을 관리할 수 있는 모달입니다.
 */
export function NotificationSettingModal() {
  const isVisible = useAtomValue(notificationSettingModalOpenAtom);
  const closeModal = useSetAtom(closeNotificationSettingModalAtom);
  const [notificationSettings, setNotificationSettings] = useAtom(
    notificationSettingsAtom,
  );
  const [tempSettings, setTempSettings] =
    useState<NotificationSettings>(notificationSettings);

  // TODO: 실제 API 호출로 대체 필요
  // 임시로 데이터 존재 여부를 확인하는 상태
  const [hasWorkspaceData] = useState<boolean>(true); // 워크스페이스 데이터 유무
  const [hasWorkloadData] = useState<boolean>(true); // 워크로드 데이터 유무

  /**
   * 모달 열림/닫힘 시 임시 설정을 현재 설정으로 초기화
   */
  const handleOpen = useCallback(() => {
    setTempSettings(notificationSettings);
  }, [notificationSettings]);

  /**
   * 취소 버튼 클릭 핸들러
   */
  const handleCancel = useCallback(() => {
    setTempSettings(notificationSettings);
    closeModal();
  }, [notificationSettings, closeModal]);

  /**
   * 수정완료 버튼 클릭 핸들러
   */
  const handleSave = useCallback(() => {
    setNotificationSettings(tempSettings);
    closeModal();
  }, [tempSettings, setNotificationSettings, closeModal]);

  /**
   * 스위치 상태 변경 핸들러
   */
  const handleSwitchChange = useCallback(
    <
      Section extends keyof NotificationSettings,
      Key extends keyof NotificationSettings[Section],
    >(
      section: Section,
      key: Key,
      type: "system" | "email",
      checked: boolean,
    ) => {
      setTempSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: {
            ...(prev[section][key] as NotificationSetting),
            [type]: checked,
          },
        },
      }));
    },
    [],
  );

  return (
    <Modal
      title="알림 설정"
      open={isVisible}
      modalWidth={580}
      centered
      showHeaderBorder
      icon={<Icon name="Noti" size={20} color="#FFF" />}
      type="primary"
      okText="수정 완료"
      cancelText="취소"
      onOk={handleSave}
      onCancel={handleCancel}
      afterOpenChange={(open) => {
        if (open) handleOpen();
      }}
    >
      <ModalContent>
        {/* 워크스페이스 섹션 */}
        <WorkspaceSection>
          <SectionTitle>워크스페이스</SectionTitle>
          {hasWorkspaceData ? (
            <Box width={540} height={50} style={{ borderColor: "#E9E9E9" }}>
              <WorkspaceContent>
                <WorkspaceNotificationItem>
                  <ItemLabel>워크스페이스 리소스 요청 결과 알림</ItemLabel>
                </WorkspaceNotificationItem>
                <WorkspaceSwitchBox>
                  <SwitchGroup>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={
                        tempSettings.workspace.resourceRequestResult.system
                      }
                      onChange={(checked) =>
                        handleSwitchChange(
                          "workspace",
                          "resourceRequestResult",
                          "system",
                          checked,
                        )
                      }
                    />
                  </SwitchGroup>
                  <div className="divider" />
                  <SwitchGroup>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={
                        tempSettings.workspace.resourceRequestResult.email
                      }
                      onChange={(checked) =>
                        handleSwitchChange(
                          "workspace",
                          "resourceRequestResult",
                          "email",
                          checked,
                        )
                      }
                    />
                  </SwitchGroup>
                </WorkspaceSwitchBox>
              </WorkspaceContent>
            </Box>
          ) : (
            <EmptyStateContainer $fullHeight={!hasWorkspaceData}>
              <EmptyState
                icon={<Icon name="DocumentFilled" color="#878898" size={32} />}
                title="설정된 워크스페이스가 없습니다."
                content="워크스페이스를 설정한 후 알림을 받으실 수 있습니다."
              />
            </EmptyStateContainer>
          )}
        </WorkspaceSection>

        {/* 워크로드 섹션 - 워크스페이스가 있을 때만 표시 */}
        {hasWorkspaceData && (
          <Section>
            <SectionTitle>워크로드</SectionTitle>
            {hasWorkloadData ? (
              <WorkloadGrid>
                <Box
                  width={176}
                  height={106}
                  style={{ borderColor: "#E9E9E9" }}
                >
                  <NotificationItem>
                    <ItemLabel>Batch Job 종료 알림</ItemLabel>
                    <SwitchBox>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="SystemFilled" size={16} />
                          <span>System</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.batchJobCompletion.system
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "batchJobCompletion",
                              "system",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="MailFilled" size={16} />
                          <span>Email</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.batchJobCompletion.email
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "batchJobCompletion",
                              "email",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                    </SwitchBox>
                  </NotificationItem>
                </Box>

                <Box
                  width={176}
                  height={106}
                  style={{ borderColor: "#E9E9E9" }}
                >
                  <NotificationItem>
                    <ItemLabel>Interactive Job-종료 시점 알림</ItemLabel>
                    <SwitchBox>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="SystemFilled" size={16} />
                          <span>System</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.interactiveJobCompletion
                              .system
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "interactiveJobCompletion",
                              "system",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="MailFilled" size={16} />
                          <span>Email</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.interactiveJobCompletion.email
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "interactiveJobCompletion",
                              "email",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                    </SwitchBox>
                  </NotificationItem>
                </Box>

                <Box
                  width={176}
                  height={106}
                  style={{ borderColor: "#E9E9E9" }}
                >
                  <NotificationItem>
                    <ItemLabel>Interactive Job - 종료 알림</ItemLabel>
                    <SwitchBox>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="SystemFilled" size={16} />
                          <span>System</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.interactiveJobTermination
                              .system
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "interactiveJobTermination",
                              "system",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="MailFilled" size={16} />
                          <span>Email</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.interactiveJobTermination
                              .email
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "interactiveJobTermination",
                              "email",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                    </SwitchBox>
                  </NotificationItem>
                </Box>

                <Box
                  width={176}
                  height={106}
                  style={{ borderColor: "#E9E9E9" }}
                >
                  <NotificationItem>
                    <ItemLabel>이미지 커밋 등록 알림</ItemLabel>
                    <SwitchBox>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="SystemFilled" size={16} />
                          <span>System</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.imageCommitRegistration.system
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "imageCommitRegistration",
                              "system",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="MailFilled" size={16} />
                          <span>Email</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.imageCommitRegistration.email
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "imageCommitRegistration",
                              "email",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                    </SwitchBox>
                  </NotificationItem>
                </Box>

                <Box
                  width={176}
                  height={106}
                  style={{ borderColor: "#E9E9E9" }}
                >
                  <NotificationItem>
                    <ItemLabel>워크로드 삭제 알림</ItemLabel>
                    <SwitchBox>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="SystemFilled" size={16} />
                          <span>System</span>
                        </IconTextGroup>
                        <Switch
                          checked={
                            tempSettings.workload.workloadDeletion.system
                          }
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "workloadDeletion",
                              "system",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="MailFilled" size={16} />
                          <span>Email</span>
                        </IconTextGroup>
                        <Switch
                          checked={tempSettings.workload.workloadDeletion.email}
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "workloadDeletion",
                              "email",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                    </SwitchBox>
                  </NotificationItem>
                </Box>

                <Box
                  width={176}
                  height={106}
                  style={{ borderColor: "#E9E9E9" }}
                >
                  <NotificationItem>
                    <ItemLabel>워크로드 에러 알림</ItemLabel>
                    <SwitchBox>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="SystemFilled" size={16} />
                          <span>System</span>
                        </IconTextGroup>
                        <Switch
                          checked={tempSettings.workload.workloadError.system}
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "workloadError",
                              "system",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                      <SwitchItem>
                        <IconTextGroup>
                          <Icon name="MailFilled" size={16} />
                          <span>Email</span>
                        </IconTextGroup>
                        <Switch
                          checked={tempSettings.workload.workloadError.email}
                          onChange={(checked) =>
                            handleSwitchChange(
                              "workload",
                              "workloadError",
                              "email",
                              checked,
                            )
                          }
                        />
                      </SwitchItem>
                    </SwitchBox>
                  </NotificationItem>
                </Box>
              </WorkloadGrid>
            ) : (
              <EmptyStateContainer>
                <EmptyState
                  icon={
                    <Icon name="DocumentFilled" color="#878898" size={32} />
                  }
                  title="생성된 워크로드가 없습니다."
                  content="워크로드를 생성한 후 알림을 받으실 수 있습니다."
                />
              </EmptyStateContainer>
            )}
          </Section>
        )}
      </ModalContent>
    </Modal>
  );
}

const ModalContent = styled.div`
  padding: 0;
  height: auto;
  overflow: visible;
`;

/* 워크스페이스 섹션 */
const WorkspaceSection = styled.div`
  margin-bottom: 16px;
`;

/* 워크스페이스 Box 내부 컨텐츠 래퍼 */
const WorkspaceContent = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

/* 워크로드 섹션 (flex 레이아웃) */
const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkloadGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 6px; /* 위아래 8px, 양옆 6px */
`;

const SectionTitle = styled.h3`
  color: #000;

  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  margin-bottom: 4px;
  margin-top: 0;
`;

const NotificationItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const WorkspaceNotificationItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const ItemLabel = styled.span`
  color: #000;

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 12px;
  display: block;

  /* 워크스페이스에서는 margin-bottom 제거 */
  ${WorkspaceNotificationItem} & {
    margin-bottom: 0;
  }
`;

/* Switch들을 감싸는 컨테이너 (배경 없음) */
const SwitchBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
`;

/* 워크스페이스용 Switch 박스 (가로 배치 및 구분선) */
const WorkspaceSwitchBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  background-color: #fafafa;
  border-radius: 4px;
  flex-shrink: 0;

  .divider {
    width: 1px;
    height: 24px;
    background-color: #e0e0e0;
    margin: 0 20px; /* 앞뒤로 20px */
  }
`;

const SwitchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 27px; /* 텍스트와 스위치 사이 27px */
  font-size: 11px;
  color: #595959;

  font-weight: 400;
`;

/* 개별 Switch 아이템 박스 (시스템, 이메일 각각) */
const SwitchItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #595959;

  font-weight: 400;
  width: 156px;
  height: 30px;
  padding: 0 8px;
  background-color: #fafafa;
  border-radius: 4px;
  box-sizing: border-box;
`;

/* 아이콘과 텍스트 그룹 */
const IconTextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

/* Empty State 컨테이너 */
const EmptyStateContainer = styled.div<{ $fullHeight?: boolean }>`
  width: 540px;
  height: ${(props) => (props.$fullHeight ? "300px" : "150px")};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.$fullHeight ? "none" : "1px solid #f0f0f0")};
  border-radius: 8px;
  background-color: #fafafa;
`;

