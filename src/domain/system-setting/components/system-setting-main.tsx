"use client";

import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { CredentialListSetting } from "@/domain/system-setting/components/credential-list-setting";
import { HpeOneviewSetting } from "@/domain/system-setting/components/hpe-oneview-setting";
import { LicenseSetting } from "@/domain/system-setting/components/license-setting";
import { ResourceRevokeSetting } from "@/domain/system-setting/components/resource-revoke-setting";
import { SmtpAccountSetting } from "@/domain/system-setting/components/smtp-account-setting";
import { StorageListSetting } from "@/domain/system-setting/components/storage-list-setting";
import { SystemSettingAside } from "@/domain/system-setting/components/system-setting-aside";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import type { CoreGuide } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

const GUIDES: readonly CoreGuide[] = [
  {
    icon: <Icon name="Astrago" color="var(--icon-fill)" />,
    title: "AstraGo란?",
    description: [
      "AstraGo는 리소스 최적화 기술을 활용한 GPU 노드의 ",
      "활용도 극대화 솔루션입니다.",
    ],
  },
  {
    icon: <Icon name="License" color="var(--icon-fill)" />,
    title: "라이선스란?",
    description: [
      "AstraGo를 원활하게 이용하기 위해 라이선스를 갱신하여 새로운",
      "라이선스 키를 인증해야 합니다.",
    ],
  },
];

/**
 * 시스템 설정 페이지 메인 컴포넌트
 */
export function SystemSettingMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey="admin.setting" description="About System Settings" />

      {/* 설정 페이지 메인 영역 */}
      <ListPageMain>
        {/* 왼쪽 영역 - 가이드 + 사이드바 */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="About System Settings"
            title="기본 설정"
            icon="Setting01"
            description={[
              "라이선스, 리소스 회수 기준, 스토리지 설정뿐만 아니라,",
              "HPE, One View, SMTP 계정 설정을 관리할 수 있습니다.",
            ]}
            backgroundImageName="monitoring-background.png"
            guides={GUIDES}
          />
          <SystemSettingAside />
        </ListPageAside>

        {/* 오른쪽 영역 - 설정 그리드 */}
        <ListPageBody>
          <SectionTitle>시스템 기본 설정</SectionTitle>
          <SettingGridContainer>
            {/* 리소스 회수 기준 */}
            <ResourceRevokeSetting />

            {/* 크레덴셜 목록 */}
            <CredentialListSetting />

            {/* 스토리지 목록 */}
            <StorageListSetting />

            {/* 오른쪽 세로 그룹 */}
            <SettingColumnGroup>
              {/* SMTP 계정 정보 */}
              <SmtpAccountSetting />

              {/* 라이선스 */}
              <LicenseSetting />

              {/* HPE One View 연동 */}
              <HpeOneviewSetting />
            </SettingColumnGroup>
          </SettingGridContainer>
        </ListPageBody>
      </ListPageMain>
    </>
  );
}

/**
 * 설정 페이지 그리드 컨테이너
 * 2열 그리드 레이아웃
 */
const SettingGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
  margin-top: 20px;
`;

/**
 * 세로 그룹 컨테이너
 */
const SettingColumnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * 섹션 타이틀
 */
const SectionTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2",
})`
  margin-top: 8px;
`;
