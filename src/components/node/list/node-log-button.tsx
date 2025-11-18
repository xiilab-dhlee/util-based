import { useRouter } from "next/navigation";
import { Button } from "xiilab-ui";

/**
 * NodeLogButton 컴포넌트의 Props 인터페이스
 */
interface NodeLogButtonProps {
  /** 대상 노드의 이름 */
  nodeName: string;
}

/**
 * 노드 Activity 로그 버튼 컴포넌트
 *
 * 노드 목록에서 특정 노드의 Activity 로그 페이지로 이동하는 버튼입니다.
 * 클릭 시 해당 노드의 로그 상세 페이지로 라우팅됩니다.
 *
 * @param nodeName - 로그를 확인할 대상 노드의 이름
 * @returns Activity 로그 버튼 컴포넌트
 */
export function NodeLogButton({ nodeName }: NodeLogButtonProps) {
  const router = useRouter();

  /**
   * Activity 로그 버튼 클릭 핸들러
   *
   * 버튼 클릭 시 해당 노드의 로그 상세 페이지로 이동합니다.
   * `/admin/node/{nodeName}/log` 경로로 라우팅됩니다.
   */
  const handleClick = () => {
    router.push(`/admin/node/${nodeName}/log`);
  };

  return (
    <Button
      size="small"
      variant="outlined"
      width={60}
      height={26}
      onClick={handleClick}
    >
      Activity
    </Button>
  );
}
