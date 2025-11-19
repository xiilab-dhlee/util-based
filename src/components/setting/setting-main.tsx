"use client";

import styled from "styled-components";
import { Breadcrumb, Icon } from "xiilab-ui";

import CredentialsSection from "@/components/setting/credentials-section";
import { MemberManagement } from "@/components/setting/member-management";
import ResourceRequests from "@/components/setting/resource-requests";
import WorkspaceDetails from "@/components/setting/workspace-details";
import { PageHeader } from "@/layouts/common/page-header";

/**
 * 설정 페이지 메인 컴포넌트
 *
 * 사용자 설정 관련 기능들을 통합 관리하는 메인 컴포넌트입니다.
 * - 멤버 관리
 * - 워크스페이스 상세 정보
 * - 리소스 신청 목록
 * - 크레덴셜 관리
 */
export default function SettingMain() {
  const breadcrumbItems = [
    {
      title: (
        <>
          <Icon name="Dashboard" size={16} />
          대시보드
        </>
      ),
      href: "/standard",
    },
    { title: "설정" },
  ];

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader title="설정" titleIcon="Setting01" description="Setting">
        <Breadcrumb items={breadcrumbItems} />
      </PageHeader>

      {/* 설정 페이지 메인 영역 - 반응형 레이아웃 */}
      <SettingContainer>
        {/* 설정 페이지 - 왼쪽 영역 (워크스페이스 상세 & 리소스 신청) */}
        <SettingLeftArea>
          <WorkspaceDetails />
          <ResourceRequests />
        </SettingLeftArea>

        {/* 설정 페이지 - 오른쪽 영역 (멤버 관리 & 크레덴셜) */}
        <SettingRightArea>
          <MemberManagement />
          <CredentialsSection />
        </SettingRightArea>
      </SettingContainer>
    </>
  );
}

// 설정페이지 전용 컨테이너
const SettingContainer = styled.section`
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: calc(100vh - 77px - 50px);
`;

// 설정페이지 전용 왼쪽 영역 스타일 - 고정 너비
const SettingLeftArea = styled.div`
  flex: 0 0 964px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 설정페이지 전용 오른쪽 영역 스타일 - 가변 너비
const SettingRightArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 620px; /* 최소 너비 보장 */
`;
