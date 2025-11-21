"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import { useGetNodeMpsInfo } from "@/domain/node/hooks/use-get-mps-info";
import { useUpdateMps } from "@/domain/node/hooks/use-update-mps";
import type { NodeListType } from "@/domain/node/schemas/node.schema";
import { openUpdateMpsModalAtom } from "@/domain/node/state/node.atom";
import type { UpdateMpsPayload } from "@/domain/node/types/node.type";
import { UpdateResourceProgress } from "@/shared/components/progress/update-resource-progress";
import { NODE_EVENTS, USER_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatFileSize } from "@/shared/utils/file.util";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

/**
 * MPS 설정 모달 컴포넌트
 * 노드의 MPS(Multi-Process Service) 설정을 변경할 수 있습니다.
 *
 * 주요 기능:
 * - GPU 총 개수, 종류, MPS 설정 GPU 개수, 분할된 GPU 메모리 정보 표시
 * - 슬라이더를 통한 MPS 복제본 개수 조정 (최소 2개, 최대 GPU 총 개수)
 * - 플러스/마이너스 버튼으로 슬라이더 값 조정
 * - 현재 설정된 값을 읽기 전용 InputNumber로 표시
 * - MPS 활성화/비활성화 토글 기능
 */
export function UpdateMpsModal() {
  const publish = usePublish();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openUpdateMpsModalAtom);

  // 노드 이름
  const [nodeName, setNodeName] = useState("");

  // 노드 MPS 정보 조회
  const { data } = useGetNodeMpsInfo(nodeName);

  // MPS 복제본 개수 상태 (기본값: 2)
  const [mpsReplicas, setMpsReplicas] = useState(2);

  // MPS 업데이트 뮤테이션
  const updateMps = useUpdateMps();

  // MPS 설정 제출 핸들러
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      updateMps.mutate(payload, {
        onSuccess: () => {
          publish(USER_EVENTS.sendUpdateUser, payload);
          onClose();
        },
      });
    }
  };

  // MPS 업데이트 페이로드 생성
  const createPayload = (): UpdateMpsPayload | null => {
    return {
      nodeName,
      mpsCapable: !data?.mpsCapable,
      mpsReplicas,
    };
  };

  // MPS 업데이트 이벤트 구독
  useSubscribe(NODE_EVENTS.sendUpdateMps, ({ nodeName }: NodeListType) => {
    setNodeName(nodeName);
    onOpen();
  });

  // 분할된 GPU 메모리 크기 계산 (현재 설정값 기준)
  const currentMem = formatFileSize(
    (data?.totalMemory || 0) / (data?.mpsReplicas || 2),
    2,
  );

  // 전체 GPU 메모리 크기 계산
  const totalMem = formatFileSize(data?.totalMemory || 0, 2);

  return (
    <Modal
      type="primary"
      icon={<Icon name="Information" color="#fff" size={14} />}
      modalWidth={370}
      open={open}
      closable
      title={nodeName}
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText={data?.mpsCapable ? "해제" : "수정 완료"}
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateMps.isPending,
      }}
    >
      <SectionTitle>MPS 기본 정보</SectionTitle>
      <Information>
        <InfoItem>
          <InfoKey>GPU 총 개수</InfoKey>
          <InfoValue>{data?.gpuCnt || 0}개</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoKey>GPU 종류</InfoKey>
          <InfoValue>{data?.gpuName || "-"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoKey>MPS 설정 GPU 개수</InfoKey>
          <InfoValue>{data?.mpsReplicas || 0}개</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoKey>분할된 GPU 메모리 정보</InfoKey>
          <InfoValue>
            {currentMem.formatted} / {totalMem.formatted}
          </InfoValue>
        </InfoItem>
      </Information>
      <SectionTitle>MPS 설정</SectionTitle>
      <UpdateResourceProgress
        min={2}
        // max={data?.mpsMaxReplicas || 0}
        max={10}
        value={mpsReplicas}
        setValue={setMpsReplicas}
        resourceColor="#376DFF"
      />
    </Modal>
  );
}

// 섹션 제목 스타일 (대시보드 섹션 제목 확장)
const SectionTitle = styled(UserMonitoringSectionTitle)`
  color: #000;
  margin-left: 7px;
  margin-bottom: 10px;
  font-size: 12px;
`;

// MPS 기본 정보 컨테이너
const Information = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e9e9e9;
  border-radius: 4px 4px 2px 2px;
  margin-bottom: 16px;
`;

// 정보 항목 컨테이너 (키-값 쌍)
const InfoItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

// 정보 키 스타일 (왼쪽 정렬, 고정 너비)
const InfoKey = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #484848;
  width: 133px;
  text-align: left;
`;

// 정보 값 스타일 (유연한 너비)
const InfoValue = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000;
  flex: 1;
`;
