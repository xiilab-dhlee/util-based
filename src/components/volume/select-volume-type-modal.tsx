"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import {
  openCreateAstragoVolumeModalAtom,
  openCreateOnPremiseVolumeModalAtom,
  openSelectVolumeModalAtom,
} from "@/atoms/volume/volume-list.atom";
import { VolumeStorageCard } from "@/components/volume/list/volume-storage-card";
import pubsubConstants from "@/constants/common/pubsub.constant";
import volumeListConstants from "@/constants/volume/volume-list.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import type { VolumeStorageType } from "@/schemas/volume.schema";

/**
 * 볼륨 스토리지 타입 선택 모달 컴포넌트
 *
 * 사용자가 볼륨을 생성할 때 사용할 스토리지 타입을 선택할 수 있는 모달입니다.
 * 선택된 스토리지 타입은 pubsub을 통해 다른 컴포넌트와 동기화됩니다.
 *
 * @returns 볼륨 스토리지 타입 선택 모달 JSX 요소
 */
export function SelectVolumeTypeModal() {
  // 모달 상태 관리
  const { open, onClose } = useGlobalModal(openSelectVolumeModalAtom);
  const setOpenCreateAstragoVolumeModal = useSetAtom(
    openCreateAstragoVolumeModalAtom,
  );
  const setOpenCreateOnPremiseVolumeModal = useSetAtom(
    openCreateOnPremiseVolumeModalAtom,
  );

  // 선택된 스토리지 타입 상태 관리
  const [storageType, setStorageType] = useState<VolumeStorageType | null>(
    null,
  );

  /**
   * 스토리지 타입 카드 클릭 핸들러
   *
   * @param type - 선택된 스토리지 타입
   */
  const handleClickStorageType = (type: VolumeStorageType) => {
    // 선택된 스토리지 타입을 로컬 상태에 저장
    setStorageType(type);

    onClose();

    if (type === "ASTRAGO") {
      setOpenCreateAstragoVolumeModal(true);
    } else if (type === "LOCAL") {
      setOpenCreateOnPremiseVolumeModal(true);
    } else {
      toast.error("스토리지 타입을 선택해 주세요.");
    }
  };

  /**
   * 선택된 스토리지 타입 초기화 핸들러
   */
  useSubscribe(pubsubConstants.volume.clearSelectVolumeModal, () => {
    setStorageType(null);
  });

  return (
    <InfoModal
      modalWidth={580}
      type="primary"
      icon={<Icon name="Folder" color="#fff" size={18} />}
      open={open}
      closable
      title="볼륨 선택"
      onClose={onClose}
      showHeaderBorder
      centered
    >
      {/* 스토리지 타입 카드들을 감싸는 컨테이너 */}
      <Container>
        {/* 사용 가능한 스토리지 타입들을 카드 형태로 렌더링 */}
        {volumeListConstants.storageType.map((item) => (
          <VolumeStorageCard
            key={item.value}
            storageType={item.value as VolumeStorageType}
            onClick={handleClickStorageType}
            isSelected={storageType === item.value}
          />
        ))}
      </Container>
    </InfoModal>
  );
}


/**
 * 스토리지 타입 카드들을 감싸는 스타일드 컴포넌트
 *
 * 카드들을 가로로 배치하고 적절한 간격을 제공합니다.
 */
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;
