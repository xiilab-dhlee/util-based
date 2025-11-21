"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { AstraGoNav, type AstraGoNavMenu, Icon } from "xiilab-ui";

import { WorkspaceSelect } from "@/shared/components/select/workspace-select";
import { PAGE_META } from "@/shared/constants/page-meta";
import { useActiveMenu } from "@/shared/hooks/use-active-menu";
import { Profile } from "@/shared/layouts/common/profile";
import { isAdminMode } from "@/shared/utils/router.util";

const USER_NAV_MENU: AstraGoNavMenu[] = [
  {
    title: "Entire",
    items: [
      {
        key: "user.monitoring",
        label: PAGE_META["user.monitoring"]?.title,
        icon: <Icon name={PAGE_META["user.monitoring"]?.iconName} />,
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
        key: "user.workload",
        label: PAGE_META["user.workload"]?.title,
        icon: <Icon name={PAGE_META["user.workload"]?.iconName} />,
      },
      // {
      //   key: "compare",
      //   label: "비교실험",
      //   icon: "ComparativeExperiment",
      // },
      {
        key: "user.private-registry-image",
        label: PAGE_META["user.private-registry-image"]?.title,
        icon: (
          <Icon name={PAGE_META["user.private-registry-image"]?.iconName} />
        ),
      },
      // {
      //   key: "public-registry",
      //   label: "외부 레지스트리",
      //   icon: "PublicRegistry",
      // },
      {
        key: "user.sourcecode",
        label: PAGE_META["user.sourcecode"]?.title,
        icon: <Icon name={PAGE_META["user.sourcecode"]?.iconName} />,
      },
      {
        key: "user.volume",
        label: PAGE_META["user.volume"]?.title,
        icon: <Icon name={PAGE_META["user.volume"]?.iconName} />,
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
        key: "user.hub",
        label: PAGE_META["user.hub"]?.title,
        icon: <Icon name={PAGE_META["user.hub"]?.iconName} />,
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "user.setting",
        label: PAGE_META["user.setting"]?.title,
        icon: <Icon name={PAGE_META["user.setting"]?.iconName} />,
      },
    ],
  },
];

const ADMIN_NAV_MENU: AstraGoNavMenu[] = [
  {
    title: "Menu",
    items: [
      {
        key: "admin.monitoring",
        label: PAGE_META["admin.monitoring"]?.title,
        icon: <Icon name={PAGE_META["admin.monitoring"]?.iconName} />,
        navigateToSelfOnOpen: true,
        children: [
          {
            key: "admin.system-monitoring",
            label: PAGE_META["admin.system-monitoring"]?.title,
          },
          {
            key: "admin.cluster-monitoring",
            label: PAGE_META["admin.cluster-monitoring"]?.title,
          },
          {
            key: "admin.monitoring-notification",
            label: PAGE_META["admin.monitoring-notification"]?.title,
          },
        ],
      },
      {
        key: "admin.account-management",
        label: PAGE_META["admin.account-management"]?.title,
        icon: <Icon name={PAGE_META["admin.account-management"]?.iconName} />,
      },
      {
        key: "admin.node",
        label: PAGE_META["admin.node"]?.title,
        icon: <Icon name={PAGE_META["admin.node"]?.iconName} />,
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
          {
            key: "admin.registry-security",
            label: PAGE_META["admin.registry-security"]?.title,
          },
          {
            key: "admin.file-security",
            label: PAGE_META["admin.file-security"]?.title,
          },
        ],
      },
      {
        key: "admin.workspace",
        label: PAGE_META["admin.workspace"]?.title,
        icon: <Icon name={PAGE_META["admin.workspace"]?.iconName} />,
        navigateToSelfOnOpen: true,
        children: [
          {
            key: "admin.workspace.request-resource",
            label: PAGE_META["admin.workspace.request-resource"]?.title,
          },
          {
            key: "admin.workspace.request-history",
            label: PAGE_META["admin.workspace.request-history"]?.title,
          },
        ],
      },
      {
        key: "admin.registry",
        label: PAGE_META["admin.registry"]?.title,
        icon: <Icon name={PAGE_META["admin.registry"]?.iconName} />,
        navigateToSelfOnOpen: true,
        children: [
          {
            key: "admin.request-image",
            label: PAGE_META["admin.request-image"]?.title,
          },
          {
            key: "admin.private-registry",
            label: PAGE_META["admin.private-registry"]?.title,
          },
          {
            key: "admin.external-registry",
            label: PAGE_META["admin.external-registry"]?.title,
          },
        ],
      },
      {
        key: "admin.sourcecode-management",
        label: PAGE_META["admin.sourcecode-management"]?.title,
        icon: (
          <Icon name={PAGE_META["admin.sourcecode-management"]?.iconName} />
        ),
      },
      {
        key: "admin.volume-management",
        label: PAGE_META["admin.volume-management"]?.title,
        icon: <Icon name={PAGE_META["admin.volume-management"]?.iconName} />,
      },
      {
        key: "admin.report",
        label: PAGE_META["admin.report"]?.title,
        icon: <Icon name={PAGE_META["admin.report"]?.iconName} />,
        navigateToSelfOnOpen: true,
        children: [
          {
            key: "admin.report-reservation",
            label: PAGE_META["admin.report-reservation"]?.title,
          },
        ],
      },
      {
        key: "admin.setting",
        label: PAGE_META["admin.setting"]?.title,
        icon: <Icon name={PAGE_META["admin.setting"]?.iconName} />,
        navigateToSelfOnOpen: true,
        children: [
          {
            key: "admin.notification",
            label: PAGE_META["admin.notification"]?.title,
          },
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
      menu={isAdmin ? ADMIN_NAV_MENU : USER_NAV_MENU}
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
