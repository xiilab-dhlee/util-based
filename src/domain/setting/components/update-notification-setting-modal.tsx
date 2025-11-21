"use client";

import styled from "styled-components";
import { Box, Icon, InfoModal, Switch } from "xiilab-ui";

import { openUpdateNotificationSettingModalAtom } from "@/domain/setting/state/setting.atom";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function UpdateNotificationSettingModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateNotificationSettingModalAtom,
  );

  /**
   * 스위치 상태 변경 핸들러
   */
  const handleSwitchChange = (checked: boolean) => {
    console.log(checked);
  };

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
        {/* 워크스페이스 섹션 */}
        <WorkspaceSection>
          <SectionTitle>워크스페이스</SectionTitle>
          <Box width="100%" height={50} style={{ borderColor: "#E9E9E9" }}>
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
                    checked={true}
                    onChange={(checked) => handleSwitchChange(checked)}
                  />
                </SwitchGroup>
                <div className="divider" />
                <SwitchGroup>
                  <IconTextGroup>
                    <Icon name="MailFilled" size={16} />
                    <span>Email</span>
                  </IconTextGroup>
                  <Switch
                    checked={true}
                    onChange={(checked) => handleSwitchChange(checked)}
                  />
                </SwitchGroup>
              </WorkspaceSwitchBox>
            </WorkspaceContent>
          </Box>
        </WorkspaceSection>
        <Section>
          <SectionTitle>워크로드</SectionTitle>
          <WorkloadGrid>
            <Box width="100%" height={106} style={{ borderColor: "#E9E9E9" }}>
              <NotificationItem>
                <ItemLabel>Batch Job 종료 알림</ItemLabel>
                <SwitchBox>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                </SwitchBox>
              </NotificationItem>
            </Box>

            <Box width="100%" height={106} style={{ borderColor: "#E9E9E9" }}>
              <NotificationItem>
                <ItemLabel>Interactive Job-종료 시점 알림</ItemLabel>
                <SwitchBox>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                </SwitchBox>
              </NotificationItem>
            </Box>

            <Box width="100%" height={106} style={{ borderColor: "#E9E9E9" }}>
              <NotificationItem>
                <ItemLabel>Interactive Job - 종료 알림</ItemLabel>
                <SwitchBox>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                </SwitchBox>
              </NotificationItem>
            </Box>

            <Box width="100%" height={106} style={{ borderColor: "#E9E9E9" }}>
              <NotificationItem>
                <ItemLabel>이미지 커밋 등록 알림</ItemLabel>
                <SwitchBox>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                </SwitchBox>
              </NotificationItem>
            </Box>

            <Box width="100%" height={106} style={{ borderColor: "#E9E9E9" }}>
              <NotificationItem>
                <ItemLabel>워크로드 삭제 알림</ItemLabel>
                <SwitchBox>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                </SwitchBox>
              </NotificationItem>
            </Box>

            <Box width="100%" height={106} style={{ borderColor: "#E9E9E9" }}>
              <NotificationItem>
                <ItemLabel>워크로드 에러 알림</ItemLabel>
                <SwitchBox>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="SystemFilled" size={16} />
                      <span>System</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                  <SwitchItem>
                    <IconTextGroup>
                      <Icon name="MailFilled" size={16} />
                      <span>Email</span>
                    </IconTextGroup>
                    <Switch
                      checked={true}
                      onChange={(checked) => handleSwitchChange(checked)}
                    />
                  </SwitchItem>
                </SwitchBox>
              </NotificationItem>
            </Box>
          </WorkloadGrid>
        </Section>
      </ModalContent>
    </InfoModal>
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
