"use client";

import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Icon } from "xiilab-ui";

import { useGetNode } from "@/domain/node/hooks/use-get-node";
import { SearchNoResult } from "@/shared/components/layouts/search-no-result";
import { REDFISH_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

/**
 * Redfish 미연동 상태를 표시하는 컴포넌트
 *
 * 노드에 Redfish가 연동되지 않은 경우 표시되며,
 * 사용자가 Redfish 연동을 시작할 수 있는 UI를 제공합니다.
 *
 */
export function UnconnectRedfish() {
  // Pub/Sub 메시지 발행을 위한 훅
  const publish = usePublish();

  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  /**
   * Redfish 연동 버튼 클릭 핸들러
   *
   * 노드의 IP 정보가 있는 경우 BMC 생성 이벤트를 발행하고,
   * IP 정보가 없는 경우 에러 토스트를 표시합니다.
   */
  const handleClickConnectRedfish = () => {
    if (data?.ip) {
      // BMC 생성 이벤트 발행 (노드 IP와 함께)
      publish(REDFISH_EVENTS.sendCreateBmc, { nodeIp: data.ip });
    } else {
      // IP 정보가 없는 경우 에러 메시지 표시
      toast.error("노드 IP 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <SearchNoResult
      icon={<Icon name="Port" color="#878898" size={32} />}
      title="연동된 Red fish가 없습니다."
      description="Red fish를 사용하기 위해 연동 설정을 해주세요."
    >
      <Button
        color="primary"
        icon="Port"
        iconPosition="left"
        iconSize={24}
        size="medium"
        variant="outlined"
        height={30}
        width={394}
        onClick={handleClickConnectRedfish}
        style={{ marginTop: 20 }}
      >
        Red fish 연동하기
      </Button>
    </SearchNoResult>
  );
}
