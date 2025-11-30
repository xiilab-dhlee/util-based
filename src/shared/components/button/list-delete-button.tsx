import { Button } from "xiilab-ui";

interface ListDeleteButtonProps {
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * 목록 삭제 버튼 컴포넌트
 */
export function ListDeleteButton({
  onClick,
  disabled,
  isLoading,
}: ListDeleteButtonProps) {
  return (
    <Button
      size="small"
      variant="outlined"
      width={80}
      onClick={onClick}
      disabled={disabled}
      loading={isLoading}
    >
      삭제
    </Button>
  );
}
