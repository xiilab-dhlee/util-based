"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { WorkloadVolumeType } from "@/domain/workload/schemas/workload.schema";
import { AstragoIcon } from "@/shared/components/icon/astrago-icon";
import { StorageIcon } from "@/shared/components/icon/storage-icon";
import {
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";
import { getVolumeStorageTypeInfo } from "../utils/volume.util";

interface WorkloadVolumeCardProps extends WorkloadVolumeType {
  onDelete?: () => void;
}

export function WorkloadVolumeCard({
  name,
  storageType,
  path,
  size,
  onDelete,
}: PropsWithChildren<WorkloadVolumeCardProps>) {
  const { text } = getVolumeStorageTypeInfo(storageType);
  return (
    <Card
      contentVariant="compact"
      title={name}
      icon={
        storageType === "ASTRAGO" ? (
          <AstragoIcon fill="#5b29c7" />
        ) : (
          <StorageIcon fill="#5b29c7" />
        )
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
          <LikeCompactCardKey>스토리지 :</LikeCompactCardKey>
          <LikeCompactCardValue className="truncate">
            {text}
          </LikeCompactCardValue>
        </LikeCompactCardRecord>
        <LikeCompactCardRecord>
          <LikeCompactCardKey>경로 :</LikeCompactCardKey>
          <LikeCompactCardValue className="truncate">
            {path || "-"}
          </LikeCompactCardValue>
        </LikeCompactCardRecord>
        <LikeCompactCardRecord>
          <LikeCompactCardKey>볼륨 크기 :</LikeCompactCardKey>
          <LikeCompactCardValue>{size} Bytes</LikeCompactCardValue>
        </LikeCompactCardRecord>
      </Body>
    </Card>
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
