import { Button } from "xiilab-ui";

import pubsubConstants from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";

/**
 * NodeGpuMpsButton 컴포넌트의 Props 인터페이스
 */
interface NodeGpuMpsButtonProps {
  /** 대상 노드의 이름 */
  nodeName: string;
}

/**
 * 노드 GPU MPS 설정 버튼 컴포넌트
 *
 * 노드 목록에서 특정 노드의 MPS(Multi-Process Service) 설정을 변경할 수 있는 버튼입니다.
 * 클릭 시 MPS 설정 변경 모달을 열기 위한 이벤트를 발행합니다.
 *
 * @param nodeName - MPS 설정을 변경할 대상 노드의 이름
 * @returns MPS 설정 버튼 컴포넌트
 */
export function NodeGpuMpsButton({ nodeName }: NodeGpuMpsButtonProps) {
  // Pub/Sub 이벤트 발행을 위한 훅
  const publish = usePublish();

  /**
   * MPS 설정 버튼 클릭 핸들러
   *
   * 버튼 클릭 시 MPS 설정 변경 모달을 열기 위한 이벤트를 발행합니다.
   * pubsubConstants.node.sendUpdateMps 이벤트와 함께 노드 이름을 전달하여
   * 해당 노드의 MPS 설정 변경 모달이 열리도록 합니다.
   */
  const handleClick = () => {
    publish(pubsubConstants.node.sendUpdateMps, {
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

