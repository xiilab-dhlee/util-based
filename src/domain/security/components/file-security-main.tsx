"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import { SecurityAside } from "./security-aside";
import { SecurityPolicySetting } from "./security-policy-setting";
import { SecurityScanListBody } from "./security-scan-list-body";
import { SecurityScanListFooter } from "./security-scan-list-footer";

export function FileSecurityMain() {
  return (
    <>
      <PageHeader
        title="파일 시스템 보안"
        icon="SecurityCheck"
        description="File System Security"
        breadcrumbKey="admin.file-security"
      />
      {/* 소스코드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 소스코드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          <PolicyHeader>
            <Title>리소스 할당량</Title>
          </PolicyHeader>
          <PolicySettings>
            <SecurityPolicySetting
              title="보안 레벨 설정"
              descriptions={[
                {
                  variant: "body-4-1",
                  content: "보안 레벨 설정 사용",
                },
                {
                  variant: "body-4-2",
                  content: "Critical 이상의 취약점 2개 이상 발견시 사용 불가",
                },
              ]}
            />
            <SecurityPolicySetting
              title="보안 검사 일정"
              descriptions={[
                {
                  variant: "body-4-1",
                  content: "정기 보안 검사 사용",
                },
                {
                  variant: "body-4-2",
                  content: "매주 금요일 18시 보안 검사 진행",
                },
              ]}
            />
          </PolicySettings>
          <ScanHeader>
            <Title>취약점 검사 내역</Title>
          </ScanHeader>
          <ScanBody>
            <SecurityScanListBody />
            <SecurityScanListFooter />
          </ScanBody>
        </ListPageBody>
        {/* 소스코드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={620}>
          <SecurityAside />
        </ListPageAside>
      </ListPageMain>
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
