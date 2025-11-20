import { Button } from "xiilab-ui";

import { NODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface NodeMpsButtonProps {
  nodeName: string;
}

/**
 * 노드 MPS 설정 버튼 컴포넌트
 *
 * 노드 목록에서 특정 노드의 MPS(Multi-Process Service) 설정을 변경할 수 있는 버튼입니다.
 * 클릭 시 MPS 설정 변경 모달을 열기 위한 이벤트를 발행합니다.
 *
 * @param nodeName - MPS 설정을 변경할 대상 노드의 이름
 * @returns MPS 설정 버튼 컴포넌트
 */
export function NodeMpsButton({ nodeName }: NodeMpsButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(NODE_EVENTS.sendUpdateMps, {
      nodeName,
    });
  };

  return (
    <Button
      size="small"
      variant="outlined"
      width={50}
      height={26}
      onClick={handleClick}
    >
      MPS
    </Button>
  );
}
