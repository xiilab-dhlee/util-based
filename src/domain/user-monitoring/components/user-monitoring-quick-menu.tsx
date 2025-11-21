import Link from "next/link";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

/**
 * 대시보드 빠른 메뉴 컴포넌트의 Props 인터페이스
 */
interface UserMonitoringQuickMenuProps {
  /** 이동할 페이지의 URL 경로 */
  href: string;
  /** 표시할 아이콘 이름 */
  icon: string;
  /** 아이콘의 크기 (픽셀 단위) */
  iconSize: number;
  /** 메뉴의 제목 (한글) */
  title: string;
  /** 메뉴의 부제목 (영문) */
  titleEng: string;
  /** 컴포넌트의 높이 (픽셀 단위, 기본값: 100) */
  height?: number;
}

/**
 * UserMonitoringQuickMenu 컴포넌트
 *
 * 대시보드에서 사용되는 빠른 메뉴 카드 컴포넌트입니다.
 * 사용자가 주요 기능에 빠르게 접근할 수 있도록 하는 네비게이션 카드로,
 * 아이콘, 제목, 부제목을 포함한 클릭 가능한 링크 형태로 구성됩니다.
 *
 * 주요 기능:
 * - 클릭 가능한 링크 형태의 메뉴 카드
 * - 아이콘과 텍스트를 포함한 시각적 표현
 * - 접근성을 고려한 스크린 리더 지원
 * - 반응형 디자인으로 다양한 화면 크기 지원
 * - 호버 효과 및 시각적 피드백 제공
 *
 * @param href - 이동할 페이지의 URL 경로
 * @param icon - 표시할 아이콘 이름 (xiilab-ui Icon 컴포넌트에서 지원하는 아이콘)
 * @param iconSize - 아이콘의 크기 (픽셀 단위)
 * @param title - 메뉴의 제목 (한글)
 * @param titleEng - 메뉴의 부제목 (영문)
 * @param height - 컴포넌트의 높이 (픽셀 단위, 기본값: 100)
 * @returns 빠른 메뉴 카드 컴포넌트
 *
 * @example
 * ```tsx
 * <UserMonitoringQuickMenu
 *   href="/admin/workspace"
 *   icon="Box"
 *   iconSize={24}
 *   title="워크스페이스 관리"
 *   titleEng="Workspace Management"
 *   height={120}
 * />
 * ```
 */
export function UserMonitoringQuickMenu({
  href,
  icon,
  iconSize,
  title,
  titleEng,
  height = 100,
}: UserMonitoringQuickMenuProps) {
  return (
    <Container href={href} $height={height}>
      {/* 메인 기능 아이콘 - 좌상단에 위치 */}
      <FeatureIconWrapper>
        <Icon name={icon} color="var(--icon-fill)" size={iconSize} />
      </FeatureIconWrapper>

      {/* 빠른 메뉴 표시 아이콘 - 우상단에 위치 */}
      <QuickMenuIconWrapper>
        <Icon name="Decrease" color="var(--icon-fill)" size={24} />
        <span className="sr-only">페이지 바로가기</span>
      </QuickMenuIconWrapper>

      {/* 텍스트 영역 - 하단에 위치 */}
      <Body>
        <Title>{title}</Title>
        <SubTitle>{titleEng}</SubTitle>
      </Body>
    </Container>
  );
}

/**
 * 빠른 메뉴 카드의 메인 컨테이너 스타일
 *
 * Next.js Link 컴포넌트를 기반으로 한 클릭 가능한 카드 컨테이너입니다.
 * 어두운 배경색과 테두리를 가지며, 커스터마이즈 가능한 높이와 반응형 너비를 가집니다.
 */
const Container = styled(Link)<{ $height: number }>`
  background-color: #171b26;
  border: 1px solid var(--secondary-border-color);
  border-radius: 4px;
  width: 100%;
  height: ${({ $height }) => $height}px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 10px;
  text-decoration: none;
`;

/**
 * 메인 기능 아이콘을 감싸는 래퍼 스타일
 *
 * 좌상단에 위치하며, 메인 기능을 나타내는 아이콘을 표시합니다.
 * 절대 위치를 사용하여 카드 내에서 고정된 위치에 배치됩니다.
 */
const FeatureIconWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: #e8eaed;
`;

/**
 * 빠른 메뉴 표시 아이콘을 감싸는 래퍼 스타일
 *
 * 우상단에 위치하며, 이 카드가 빠른 메뉴임을 나타내는 화살표 아이콘을 표시합니다.
 * 아이콘은 220도 회전되어 하향 화살표로 표시됩니다.
 */
const QuickMenuIconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: rgba(255, 255, 255, 0.5);

  & svg {
    rotate: 220deg;
  }
`;

/**
 * 텍스트 영역을 감싸는 래퍼 스타일
 *
 * 카드 하단에 위치하며, 제목과 부제목을 세로로 배치합니다.
 * flexbox를 사용하여 텍스트 요소들을 정렬합니다.
 */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/**
 * 메뉴 제목 스타일
 *
 * 한글 제목을 표시하는 스타일입니다.
 * 굵은 폰트와 큰 크기로 주요 정보를 강조합니다.
 */
const Title = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  color: #d1d1d1;
`;

/**
 * 메뉴 부제목 스타일
 *
 * 영문 부제목을 표시하는 스타일입니다.
 * 일반 폰트와 작은 크기로 보조 정보를 제공합니다.
 */
const SubTitle = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #868994;
  text-decoration: none;
`;
