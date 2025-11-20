"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { AstraGoNav, type AstraGoNavMenu, Icon } from "xiilab-ui";

import { MONITORING_MENU_ICON } from "@/domain/monitoring/constants/monitoring.constant";
import { NODE_MENU_ICON } from "@/domain/node/constants/node.constant";
import { WorkspaceSelect } from "@/shared/components/select/workspace-select";
import { useActiveMenu } from "@/shared/hooks/use-active-menu";
import { Profile } from "@/shared/layouts/common/profile";
import { isAdminMode } from "@/shared/utils/router.util";

const STANDARD_NAV_MENU: AstraGoNavMenu[] = [
  {
    title: "Entire",
    items: [
      {
        key: "dashboard",
        label: "대시보드",
        icon: <Icon name="Dashboard" />,
      },
      {
        type: "divider",
      },
    ],
  },
  {
    title: "WORK",
    items: [
      {
        key: "workload",
        label: "워크로드",
        icon: <Icon name="Workload" />,
      },
      // {
      //   key: "compare",
      //   label: "비교실험",
      //   icon: "ComparativeExperiment",
      // },
      {
        key: "private-registry-image",
        label: "내부 레지스트리",
        icon: <Icon name="Image" />,
      },
      // {
      //   key: "public-registry",
      //   label: "외부 레지스트리",
      //   icon: "PublicRegistry",
      // },
      {
        key: "sourcecode",
        label: "소스코드",
        icon: <Icon name="SourceCode" />,
      },
      {
        key: "volume",
        label: "볼륨",
        icon: <Icon name="Volume" />,
      },
      // {
      //   key: "model",
      //   label: "모델관리",
      //   icon: "Model",
      // },
      // {
      //   key: "service",
      //   label: "서비스",
      //   icon: "Service",
      // },
      {
        key: "hub",
        label: "허브",
        icon: <Icon name="Hub" />,
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "setting",
        label: "설정",
        icon: <Icon name="Setting01" />,
      },
    ],
  },
];

const ADMIN_NAV_MENU: AstraGoNavMenu[] = [
  {
    title: "Menu",
    items: [
      {
        key: "monitoring-root",
        label: "모니터링",
        icon: <Icon name={MONITORING_MENU_ICON} />,
        children: [
          { key: "monitoring", label: "모니터링 메인" },
          { key: "system-monitoring", label: "시스템 모니터링" },
          { key: "cluster-monitoring", label: "클러스터 모니터링" },
          { key: "monitoring-notification", label: "모니터링 알림" },
        ],
      },
      {
        key: "node",
        label: "노드 관리",
        icon: <Icon name={NODE_MENU_ICON} />,
      },
      // {
      //   key: "schedule",
      //   label: "스케쥴링 큐 관리",
      //   icon: "Calendar",
      // },
      {
        key: "security-root",
        label: "보안 관리",
        icon: <Icon name="SecurityCheck" />,
        children: [
          { key: "registry-security", label: "레지스트리 보안" },
          { key: "file-security", label: "파일 시스템 보안" },
        ],
      },
      {
        key: "workspace-root",
        label: "워크스페이스 관리",
        icon: <Icon name="Workspace01" />,
        children: [
          { key: "workspace", label: "워크스페이스" },
          { key: "request-resource", label: "리소스 신청 관리" },
        ],
      },
      {
        key: "registry-root",
        label: "레지스트리",
        icon: <Icon name="Image" />,
        children: [
          { key: "registry", label: "레지스트리 메인" },
          { key: "request-image", label: "이미지 사용 요청 관리" },
          { key: "private-registry", label: "내부 레지스트리" },
          // { key: "registry-public", label: "외부 레지스트리" },
        ],
      },
      {
        key: "report",
        label: "리포트",
        icon: <Icon name="Information" />,
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "setting-root",
        label: "설정",
        icon: <Icon name="Setting01" />,
        children: [
          { key: "user", label: "계정 관리" },
          { key: "notification", label: "알림 관리" },
        ],
      },
    ],
  },
];

export function MyNavigation() {
  const pathname = usePathname();

  const { activeMenuKey, onMenuClick } = useActiveMenu();

  const isAdmin = isAdminMode(pathname);

  return (
    <AstraGoNav
      defaultActiveMenuKey={activeMenuKey}
      menu={isAdmin ? ADMIN_NAV_MENU : STANDARD_NAV_MENU}
      logoImgSrc="/images/logo.png"
      onMenuClick={onMenuClick}
      header={
        !isAdmin && (
          <Header>
            <WorkspaceSelect />
          </Header>
        )
      }
      footer={
        <Footer>
          <Profile />
        </Footer>
      }
    />
  );
}

const Header = styled.div`
  height: 62px;
  padding: 0 10px 30px 10px;
`;

const Footer = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
