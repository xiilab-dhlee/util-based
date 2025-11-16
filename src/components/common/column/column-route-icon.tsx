import { useRouter } from "next/navigation";

import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "../../../styles/layers/column-layer.styled";
import { MyIcon } from "../icon";

/**
 * 테이블 컬럼에서 사용되는 클릭 가능한 라우팅 아이콘 컴포넌트
 *
 * 이 컴포넌트는 테이블의 각 행에서 특정 페이지로 이동할 수 있는
 * 클릭 가능한 아이콘을 렌더링합니다. disabled 상태일 때는 클릭이 비활성화됩니다.
 */
interface ColumnRouteIconProps {
  /** 표시할 아이콘의 이름 (xiilab-ui Icon 컴포넌트에서 사용) */
  icon: string;
  /** 아이콘 크기 */
  iconSize: number;
  /** 클릭 시 이동할 경로 */
  href: string;
  /** 아이콘 클릭 비활성화 여부 (기본값: false) */
  disabled?: boolean;
}

export function ColumnRouteIcon({
  icon,
  iconSize = 16,
  href,
  disabled = false,
}: ColumnRouteIconProps) {
  const router = useRouter();

  const handleClick = () => {
    // 비활성화된 경우 클릭 동작 무시
    if (disabled) return;

    // 지정된 경로로 페이지 이동
    router.push(href);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClick} disabled={disabled}>
        <MyIcon name={icon} color="var(--icon-fill)" size={iconSize} />
        <span className="sr-only">다음 페이지로 이동</span>
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
