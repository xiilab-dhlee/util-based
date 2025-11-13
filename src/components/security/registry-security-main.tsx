"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import SecurityAside from "./security-aside";
import SecurityPolicySetting from "./security-policy-setting";
import SecurityScanListBody from "./security-scan-list-body";
import SecurityScanListFooter from "./security-scan-list-footer";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "레지스트리 보안" },
];

export function RegistrySecurityMain() {
  return (
    <>
      <PageHeader
        title="레지스트리 보안"
        icon="SecurityCheck"
        description="Registry Security"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 소스코드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 소스코드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          <PolicyHeader>
            <Title>리소스 할당량</Title>
          </PolicyHeader>
          <PolicySettings>
            <SecurityPolicySetting
              title="내부 레지스트리 이미지 보안 검증"
              descriptions={[
                {
                  variant: "body-4-2",
                  content:
                    "사설 레지스트리에서 가져온 컨테이너 이미지의 보안 검사",
                },
                {
                  variant: "body-4-2",
                  content: "수행 여부 설정",
                },
              ]}
            />
            <SecurityPolicySetting
              title="외부 레지스트리 이미지 보안 검증"
              descriptions={[
                {
                  variant: "body-4-2",
                  content:
                    "Docker Hub 등 공개 레지스트리에서 가져온 이미지의 보안 검사",
                },
                {
                  variant: "body-4-2",
                  content: "수행 여부 설정",
                },
              ]}
            />
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
