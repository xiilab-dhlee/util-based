import styled from "styled-components";
import { Icon } from "xiilab-ui";

/**
 * DrawerCloseButton 컴포넌트 Props 인터페이스
 *
 * @property onClick - 드로어를 닫는 클릭 이벤트 핸들러 함수
 */
interface DrawerCloseButtonProps {
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
}

/**
 * DrawerCloseButton 컴포넌트
 *
 * 드로어(Drawer) 컴포넌트의 우측 상단에 위치하는 닫기 버튼입니다.
 * 클릭 시 부모 컴포넌트에서 전달받은 onClick 핸들러를 실행하여 드로어를 닫습니다.
 *
 * @param props - DrawerCloseButtonProps 객체
 * @param props.onClick - 드로어 닫기 이벤트 핸들러
 *
 * @example
 * ```tsx
 * <DrawerCloseButton onClick={() => setIsDrawerOpen(false)} />
 * ```
 *
 * @returns 닫기 아이콘이 포함된 버튼 요소
 */
export function DrawerCloseButton({ onClick }: DrawerCloseButtonProps) {
  return (
    <Container type="button" onClick={onClick}>
      <Icon name="Close" color="#000" />
    </Container>
  );
}

/**
 * DrawerCloseButton의 스타일링된 컨테이너
 *
 * - flexbox를 사용하여 우측 정렬
 * - 아이콘을 중앙에 배치
 * - 기본 버튼 스타일을 상속받음
 */
const Container = styled.button`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
