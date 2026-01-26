"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { AstraGoNav, type AstraGoNavMenu, Icon } from "xiilab-ui";

import { WorkspaceSelect } from "@/shared/components/select/workspace-select";
import { PAGE_META } from "@/shared/constants/page-meta.constant";
import { useActiveMenu } from "@/shared/hooks/use-active-menu";
import { isAdminMode } from "@/shared/utils/router.util";
import { Profile } from "./profile";

const USER_NAV_MENU: AstraGoNavMenu[] = [
  {
    title: "Menu",
    items: [
      {
        key: "user.monitoring",
        label: PAGE_META["user.monitoring"]?.title,
        icon: <Icon name={PAGE_META["user.monitoring"]?.iconName} />,
      },
      {
        key: "user.workload",
        label: PAGE_META["user.workload"]?.title,
        icon: <Icon name={PAGE_META["user.workload"]?.iconName} />,
      },
      {
        key: "user.private-registry",
        label: PAGE_META["user.private-registry"]?.title,
        icon: <Icon name={PAGE_META["user.private-registry"]?.iconName} />,
      },
      {
        key: "user.public-registry",
        label: PAGE_META["user.public-registry"]?.title,
        icon: <Icon name={PAGE_META["user.public-registry"]?.iconName} />,
      },
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
      {
        key: "user.hub",
        label: PAGE_META["user.hub"]?.title,
        icon: <Icon name={PAGE_META["user.hub"]?.iconName} />,
      },
      {
        type: "divider",
      },
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
            key: "admin.kubernetes-monitoring",
            label: PAGE_META["admin.kubernetes-monitoring"]?.title,
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
        key: "admin.scheduling-queue",
        label: PAGE_META["admin.scheduling-queue"]?.title,
        icon: <Icon name={PAGE_META["admin.scheduling-queue"]?.iconName} />,
      },
      {
        key: "admin.node",
        label: PAGE_META["admin.node"]?.title,
        icon: <Icon name={PAGE_META["admin.node"]?.iconName} />,
      },
      // {
      //   key: "security-root",
      //   label: "보안 관리",
      //   icon: <Icon name="SecurityCheck" />,
      //   children: [
      //     {
      //       key: "admin.registry-security",
      //       label: PAGE_META["admin.registry-security"]?.title,
      //     },
      //     {
      //       key: "admin.file-security",
      //       label: PAGE_META["admin.file-security"]?.title,
      //     },
      //   ],
      // },
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
            key: "admin.workspace.revoke-history",
            label: PAGE_META["admin.workspace.revoke-history"]?.title,
          },
        ],
      },
      {
        key: "admin.resource-preset",
        label: PAGE_META["admin.resource-preset"]?.title,
        icon: <Icon name={PAGE_META["admin.resource-preset"]?.iconName} />,
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
            key: "admin.public-registry",
            label: PAGE_META["admin.public-registry"]?.title,
          },
        ],
      },
      {
        key: "admin.sourcecode",
        label: PAGE_META["admin.sourcecode"]?.title,
        icon: <Icon name={PAGE_META["admin.sourcecode"]?.iconName} />,
      },
      {
        key: "admin.volume",
        label: PAGE_META["admin.volume"]?.title,
        icon: <Icon name={PAGE_META["admin.volume"]?.iconName} />,
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
/**
 * Navigation 컴포넌트
 *
 * @returns Navigation 컴포넌트
 */
export function Navigation() {
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
