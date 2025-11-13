"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { AstraGoNav, Icon, type MenuItem } from "xiilab-ui";

import { WorkspaceSelect } from "@/components/common/select/workspace-select";
import layoutConstants from "@/constants/common/layout.constant";
import { useActiveMenu } from "@/hooks/common/use-active-menu";
import { Profile } from "@/layouts/common/profile";
import type { CoreNavMenu } from "@/types/common/core.model";
import { isAdminMode } from "@/utils/common/router.util";

/**
 * MenuItem의 icon을 Icon 컴포넌트로 매핑하는 함수
 */
const mapMenuItemIcon = (item: MenuItem | null): MenuItem | null => {
  if (!item) {
    return item;
  }

  // divider 타입은 그대로 반환
  if ("type" in item && item.type === "divider") {
    return item;
  }

  // children이 있는 경우 (서브메뉴)
  if ("children" in item && item.children) {
    return {
      ...item,
      children: item.children.map(mapMenuItemIcon),
    } as MenuItem;
  }

  // icon이 문자열인 경우 ReactNode로 변환
  if ("icon" in item && item.icon && typeof item.icon === "string") {
    return {
      ...item,
      icon: (
        <Icon
          name={item.icon}
          size={layoutConstants.navIconSize}
          color={layoutConstants.navIconColor}
        />
      ),
    } as MenuItem;
  }

  return item;
};

/**
 * 메뉴 아이템의 icon을 Icon 컴포넌트로 매핑하는 함수
 */
const mapIconToComponent = (menus: CoreNavMenu[]): CoreNavMenu[] =>
  menus.map((menu) => ({
    ...menu,
    items: menu.items
      .map(mapMenuItemIcon)
      .filter((item): item is MenuItem => item !== null),
  }));

export function MyNavigation() {
  const pathname = usePathname();

  const { activeMenuKey, onMenuClick } = useActiveMenu();

  const isAdmin = isAdminMode(pathname);

  // 메뉴 데이터에 icon 매핑 적용
  const processedMenu = mapIconToComponent(
    layoutConstants[isAdmin ? "adminNavMenus" : "standardNavMenus"],
  );

  return (
    <AstraGoNav
      defaultActiveMenuKey={activeMenuKey}
      menu={processedMenu}
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
