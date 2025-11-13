import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import type { ReactNode } from "react";
import styled from "styled-components";

interface MyDropdownProps {
  /** 드롭다운 메뉴 아이템들 */
  items: ReactNode[];
  /** 드롭다운 트리거 요소 */
  children: ReactNode;
  /** 드롭다운 위치 */
  placement?:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";
  /** 트리거 방식 */
  trigger?: ("click" | "hover" | "contextMenu")[];
  /** 드롭다운 컨테이너 스타일 */
  containerStyle?: React.CSSProperties;
}

/**
 * 재사용 가능한 커스텀 드롭다운 컴포넌트
 *
 * @param items - 드롭다운 메뉴 아이템들 (ReactNode 배열)
 * @param children - 드롭다운 트리거 요소
 * @param placement - 드롭다운 위치 (기본값: "topLeft")
 * @param trigger - 트리거 방식 (기본값: ["click"])
 * @param containerStyle - 드롭다운 컨테이너 스타일
 *
 * @example
 * ```tsx
 * <MyDropdown items={["폴더 추가", "압축", "압축 해제", "삭제"]}>
 *   <Button>메뉴</Button>
 * </MyDropdown>
 * ```
 */
export function MyDropdown({
  items,
  children,
  placement = "topLeft",
  trigger = ["click"],
  containerStyle,
}: MyDropdownProps) {
  // ReactNode 배열을 MenuProps 형태로 변환
  const menuItems: MenuProps["items"] = items.map((item, index) => ({
    label: item,
    key: index.toString(),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={trigger}
      placement={placement}
      popupRender={(menu) => (
        <CustomDropdownMenu style={containerStyle}>{menu}</CustomDropdownMenu>
      )}
    >
      {children}
    </Dropdown>
  );
}


// 커스텀 드롭다운 스타일 컴포넌트
const CustomDropdownMenu = styled.div`
  .ant-dropdown-menu {
    background-color: #fafafa !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    box-shadow: 0px 4px 8px 0px rgba(104, 110, 139, 0.15) !important;
    border-radius: 2px !important;
    border: 1px solid #e1e7eb !important;
  }

  .ant-dropdown-menu li {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
  }

  .ant-dropdown-menu li:not(:first-child) {
    border-top: 1px solid #e1e7eb !important;
  }
`;
