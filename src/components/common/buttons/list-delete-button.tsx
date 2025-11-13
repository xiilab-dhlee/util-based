import { Button } from "xiilab-ui";

interface ListDeleteButtonProps {
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
}

/**
 * 목록 삭제 버튼 컴포넌트
 */
export function ListDeleteButton({ onClick }: ListDeleteButtonProps) {
  return (
    <Button size="small" variant="outlined" width={80} onClick={onClick}>
      삭제
    </Button>
  );
}

