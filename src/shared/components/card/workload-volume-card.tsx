"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { WorkloadVolumeDetail } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getVolumeStorageTypeInfo } from "@/domain/volume/utils/volume.util";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import {
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";

interface WorkloadVolumeCardProps
  extends Pick<
    WorkloadVolumeDetail,
    "volumeId" | "volumeName" | "volumeType" | "mountPath" | "volumeSize"
  > {
  onDelete?: () => void;
}

/**
 * 워크로드 볼륨 카드 컴포넌트
 *
 * 워크로드에 연결된 볼륨 정보를 표시합니다.
 */
export function WorkloadVolumeCard({
  volumeName,
  volumeType,
  mountPath,
  volumeSize,
  onDelete,
}: PropsWithChildren<WorkloadVolumeCardProps>) {
  const { text } = getVolumeStorageTypeInfo(volumeType);
  return (
    <div data-testid={WORKLOAD_SELECTOR.VOLUME_CARD}>
      <Card
        contentVariant="compact"
        title={volumeName}
        actionElement={
          onDelete ? (
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={onDelete}
            >
              <Icon name="Close" size={16} color="#484848" />
              <span className="sr-only">설정된 워크로드 볼륨 삭제</span>
            </IconWrapper>
          ) : undefined
        }
      >
        <Body>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>스토리지 타입 :</LikeCompactCardKey>
            <LikeCompactCardValue
              className="truncate"
              data-testid={WORKLOAD_SELECTOR.volumeStorageType(
                volumeType.toLowerCase(),
              )}
            >
              {text}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>경로 :</LikeCompactCardKey>
            <LikeCompactCardValue
              className="truncate"
              data-testid={WORKLOAD_SELECTOR.VOLUME_PATH}
            >
              {mountPath || "-"}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>볼륨 크기 :</LikeCompactCardKey>
            <LikeCompactCardValue
              className="truncate"
              data-testid={WORKLOAD_SELECTOR.VOLUME_SIZE}
            >
              {volumeSize.toLocaleString()} Bytes
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
        </Body>
      </Card>
    </div>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  background: #FAFAFA;
  border-radius: 2px;
  border: 1px solid #CED2D6;
`;
