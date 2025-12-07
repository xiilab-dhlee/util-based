"use client";

import { useState } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { createSecurityLevelDescription } from "@/domain/security/utils/security-level.util";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  SECURITY_SCHEDULE_PERIOD_UNIT_WEEK,
  SECURITY_USAGE_DISABLED,
  SECURITY_USAGE_ENABLED,
  type SecurityUsageStatus,
  type SecurityWeekDayKey,
} from "@/shared/constants/security.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import { createSecurityScheduleDescription } from "../utils/security-schedule.util";
import { FileSecurityScanListBody } from "./file-security/file-security-scan-list-body";
import { FileSecurityScanListFooter } from "./file-security/file-security-scan-list-footer";
import { FileSecurityLevelSettingModal } from "./file-security-level-setting-modal";
import { FileSecurityScheduleSettingModal } from "./file-security-schedule-setting-modal";
import { SecurityAside } from "./security-aside";
import { SecurityLevelPolicySetting } from "./security-level-policy-setting";

export function FileSecurityMain() {
  const [openSecurityLevelModal, setOpenSecurityLevelModal] = useState(false);
  const [openSecurityScheduleModal, setOpenSecurityScheduleModal] =
    useState(false);

  const TEMP_USAGE_STATUS: SecurityUsageStatus = SECURITY_USAGE_ENABLED;

  const levelDescription = createSecurityLevelDescription({
    usageStatus: TEMP_USAGE_STATUS,
    level: "critical",
    thresholdCount: 5,
  });

  // TODO: 이후 실제 API 연동 시, 아래 mock 값들을 실제 설정 값으로 교체합니다.
  const MOCK_PERIOD_VALUE = 1;
  const MOCK_PERIOD_UNIT = SECURITY_SCHEDULE_PERIOD_UNIT_WEEK;
  const MOCK_WEEK_DAYS: SecurityWeekDayKey[] = ["mon", "fri"];
  const MOCK_START_DATETIME = new Date();
  MOCK_START_DATETIME.setHours(18, 0, 0, 0);

  const scheduleDescription = createSecurityScheduleDescription({
    scheduleUsage: TEMP_USAGE_STATUS,
    periodValue: MOCK_PERIOD_VALUE,
    periodUnit: MOCK_PERIOD_UNIT,
    weekDays: MOCK_WEEK_DAYS,
    startDateTime: MOCK_START_DATETIME,
    endDateUsage: SECURITY_USAGE_DISABLED,
    endDateTime: null,
  });
  return (
    <>
      <PageHeader
        pageKey="admin.file-security"
        description="File System Security"
      />
      {/* 소스코드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 소스코드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          <PolicyHeader>
            <Title>파일 시스템 보안 정책 설정</Title>
          </PolicyHeader>
          <PolicySettings>
            <SecurityLevelPolicySetting
              title="보안 레벨 설정"
              usageStatus={TEMP_USAGE_STATUS}
              descriptions={[
                {
                  variant: "body-4-1",
                  content: "보안 레벨 설정 사용",
                },
                {
                  variant: "body-4-2",
                  content: levelDescription,
                },
              ]}
              onClickSetting={() => setOpenSecurityLevelModal(true)}
            />
            <SecurityLevelPolicySetting
              title="보안 검사 일정"
              usageStatus={TEMP_USAGE_STATUS}
              descriptions={[
                {
                  variant: "body-4-1",
                  content: "정기 보안 검사 사용",
                },
                {
                  variant: "body-4-2",
                  content: scheduleDescription,
                },
              ]}
              onClickSetting={() => setOpenSecurityScheduleModal(true)}
            />
          </PolicySettings>
          <ScanHeader>
            <Title>취약점 검사 내역</Title>
          </ScanHeader>
          <ScanBody>
            <FileSecurityScanListBody />
            <FileSecurityScanListFooter />
          </ScanBody>
        </ListPageBody>
        {/* 소스코드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={ASIDE_WIDTH}>
          <SecurityAside />
        </ListPageAside>
      </ListPageMain>
      <FileSecurityLevelSettingModal
        open={openSecurityLevelModal}
        onClose={() => setOpenSecurityLevelModal(false)}
      />
      <FileSecurityScheduleSettingModal
        open={openSecurityScheduleModal}
        onClose={() => setOpenSecurityScheduleModal(false)}
      />
    </>
  );
}

const PolicyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PolicySettings = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px 0;
  background-color: #fcfcfc;
  margin-bottom: 20px;
`;

const ScanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const Title = styled(Typography.Text).attrs({ variant: "subtitle-2" })`
  ${subTitleStyle(5)}

  margin-left: 5px;
`;

const ScanBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background-color: #fcfcfc;
  padding: 20px;
`;
