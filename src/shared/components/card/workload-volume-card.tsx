"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import {
  getVolumeStatusInfo,
  getVolumeStorageTypeInfo,
} from "@/domain/volume/utils/volume.util";
import type { WorkloadVolumeType } from "@/domain/workload/schemas/workload.schema";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import {
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";

interface WorkloadVolumeCardProps extends WorkloadVolumeType {
  onDelete?: () => void;
}

export function WorkloadVolumeCard({
  name,
  storageType,
  path,
  size,
  status,
  onDelete,
}: PropsWithChildren<WorkloadVolumeCardProps>) {
  const { text } = getVolumeStorageTypeInfo(storageType);
  const { icon } = getVolumeStatusInfo(status);
  return (
    <CardWrapper data-testid={WORKLOAD_SELECTOR.VOLUME_CARD}>
      <Card
        contentVariant="compact"
        title={name}
        icon={
          <span
            data-testid={WORKLOAD_SELECTOR.volumeStatus(status.toLowerCase())}
          >
            <Icon name={icon} color="#464B51" size={18} />
          </span>
        }
        actionElement={
          onDelete ? (
            <IconWrapper onClick={onDelete}>
              <Icon name="Close" size={16} color="#484848" />
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
                storageType.toLowerCase(),
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
              {path || "-"}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>볼륨 크기 :</LikeCompactCardKey>
            <LikeCompactCardValue data-testid={WORKLOAD_SELECTOR.VOLUME_SIZE}>
              {size.toLocaleString()} Bytes
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
        </Body>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div``;

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
