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
        key: "monitoring",
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
        key: "workload",
        label: PAGE_META["user.workload"]?.title,
        icon: <Icon name={PAGE_META["user.workload"]?.iconName} />,
      },
      // {
      //   key: "compare",
      //   label: "비교실험",
      //   icon: "ComparativeExperiment",
      // },
      {
        key: "private-registry-image",
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
        key: "sourcecode",
        label: PAGE_META["user.sourcecode"]?.title,
        icon: <Icon name={PAGE_META["user.sourcecode"]?.iconName} />,
      },
      {
        key: "volume",
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
        key: "hub",
        label: PAGE_META["user.hub"]?.title,
        icon: <Icon name={PAGE_META["user.hub"]?.iconName} />,
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "setting",
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
        key: "monitoring-root",
        label: PAGE_META["admin.monitoring"]?.title,
        icon: <Icon name={PAGE_META["admin.monitoring"]?.iconName} />,
        children: [
          { key: "monitoring", label: PAGE_META["admin.monitoring"]?.title },
          {
            key: "system-monitoring",
            label: PAGE_META["admin.system-monitoring"]?.title,
          },
          {
            key: "cluster-monitoring",
            label: PAGE_META["admin.cluster-monitoring"]?.title,
          },
          {
            key: "monitoring-notification",
            label: PAGE_META["admin.monitoring-notification"]?.title,
          },
        ],
      },
      {
        key: "node",
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
            key: "registry-security",
            label: PAGE_META["admin.registry-security"]?.title,
          },
          {
            key: "file-security",
            label: PAGE_META["admin.file-security"]?.title,
          },
        ],
      },
      {
        key: "workspace-root",
        label: PAGE_META["admin.workspace"]?.title,
        icon: <Icon name={PAGE_META["admin.workspace"]?.iconName} />,
        children: [
          { key: "workspace", label: PAGE_META["admin.workspace"]?.title },
          {
            key: "request-resource",
            label: PAGE_META["admin.request-resource"]?.title,
          },
        ],
      },
      {
        key: "registry-root",
        label: PAGE_META["admin.registry"]?.title,
        icon: <Icon name={PAGE_META["admin.registry"]?.iconName} />,
        children: [
          { key: "registry", label: PAGE_META["admin.registry"]?.title },
          {
            key: "request-image",
            label: PAGE_META["admin.request-image"]?.title,
          },
          {
            key: "private-registry",
            label: PAGE_META["admin.private-registry"]?.title,
          },
          // { key: "registry-public", label: "외부 레지스트리" },
        ],
      },
      {
        key: "report",
        label: PAGE_META["admin.report"]?.title,
        icon: <Icon name={PAGE_META["admin.report"]?.iconName} />,
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "setting-root",
        label: PAGE_META["admin.setting"]?.title,
        icon: <Icon name={PAGE_META["admin.setting"]?.iconName} />,
        children: [
          { key: "user", label: PAGE_META["admin.user"]?.title },
          {
            key: "notification",
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
