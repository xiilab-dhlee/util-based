import styled from "styled-components";
import { Button } from "xiilab-ui";

import { MyDropdown } from "@/shared/components/dropdown";
import { NODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

/**
 * NodeGpuDivisionButton 컴포넌트의 Props 인터페이스
 */
interface NodeGpuDivisionButtonProps {
  /** 대상 노드의 이름 */
  nodeName: string;
}

/**
 * 노드 GPU 분할 설정 버튼 컴포넌트
 *
 * 노드 목록에서 특정 노드의 GPU 분할 설정(MIG, MPS)을 변경할 수 있는 드롭다운 버튼입니다.
 * "설정" 버튼을 클릭하면 MIG와 MPS 설정 옵션이 포함된 드롭다운 메뉴가 표시됩니다.
 * 각 옵션 클릭 시 해당 설정 변경 모달을 열기 위한 이벤트를 발행합니다.
 *
 * @param nodeName - GPU 분할 설정을 변경할 대상 노드의 이름
 * @returns GPU 분할 설정 드롭다운 버튼 컴포넌트
 */
export function NodeGpuDivisionButton({
  nodeName,
}: NodeGpuDivisionButtonProps) {
  // Pub/Sub 이벤트 발행을 위한 훅
  const publish = usePublish();

  /**
   * MIG 설정 버튼 클릭 핸들러
   *
   * MIG 설정 옵션 클릭 시 MIG 설정 변경 모달을 열기 위한 이벤트를 발행합니다.
   * NODE_EVENTS.sendUpdateMig 이벤트와 함께 노드 이름을 전달하여
   * 해당 노드의 MIG 설정 변경 모달이 열리도록 합니다.
   */
  const handleClickMig = () => {
    publish(NODE_EVENTS.sendUpdateMig, {
      nodeName,
    });
  };

  /**
   * MPS 설정 버튼 클릭 핸들러
   *
   * MPS 설정 옵션 클릭 시 MPS 설정 변경 모달을 열기 위한 이벤트를 발행합니다.
   * NODE_EVENTS.sendUpdateMps 이벤트와 함께 노드 이름을 전달하여
   * 해당 노드의 MPS 설정 변경 모달이 열리도록 합니다.
   */
  const handleClickMps = () => {
    publish(NODE_EVENTS.sendUpdateMps, {
      nodeName,
    });
  };

  return (
    <MyDropdown
      placement="bottom"
      items={[
        <StyledButton key="mig" type="button" onClick={handleClickMig}>
          MIG
        </StyledButton>,
        <StyledButton key="mps" type="button" onClick={handleClickMps}>
          MPS
        </StyledButton>,
      ]}
    >
      <Button size="small" variant="outlined" width={50} height={26}>
        설정
      </Button>
    </MyDropdown>
  );
}

/**
 * 드롭다운 메뉴 아이템용 스타일된 버튼 컴포넌트
 *
 * MyDropdown의 items 배열에서 사용되는 커스텀 스타일 버튼입니다.
 * myDropdownButtonStyle 믹스인을 적용하여 드롭다운 메뉴 아이템에 적합한 스타일을 제공합니다.
 */
const StyledButton = styled.button`
  ${myDropdownButtonStyle}

  width: 50px;
  justify-content: center;
`;
