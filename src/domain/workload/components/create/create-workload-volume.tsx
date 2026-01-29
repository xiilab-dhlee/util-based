"use client";

import classNames from "classnames";
import { isEmpty } from "es-toolkit/compat";
import { useAtom } from "jotai";
import type { ChangeEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Card, Icon, Input, Typography } from "xiilab-ui";

import type { VolumeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { VolumeSelect } from "@/domain/volume/components/volume-select";
import { getVolumeStorageTypeInfo } from "@/domain/volume/utils/volume.util";
import {
  type WorkloadVolumeInfoUiType,
  workloadVolumeInfoMapUiAtom,
  workloadVolumesAtom,
} from "@/domain/workload/state/create-workload.atom";
import type { WorkloadVolumeType } from "@/domain/workload/types/workload.type";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { VolumeMountPathTooltipTitle } from "@/shared/components/tooltip-title/volume-mount-path-tooltip-title";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { getVisibilityInfo } from "@/shared/utils/visibility.util";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { errorTextStyle } from "@/styles/mixins/text";

export function CreateWorkloadVolume() {
  const [volumes, setVolumes] = useAtom(workloadVolumesAtom);
  const [volumeInfoMap, setVolumeInfoMap] = useAtom(
    workloadVolumeInfoMapUiAtom,
  );

  const [collapsed, setCollapsed] = useState(false);

  const [volume, setVolume] = useState<VolumeListResponse | null>(null);

  const [mountPath, setMountPath] = useState<string | null>(null);
  const [addErrors, setAddErrors] = useState({
    volume: "",
    mountPath: "",
  });

  // const publish = usePublish();
  // const handleCreateVolume = () => {
  //   publish(VOLUME_EVENTS.openSelectStorageTypeModal);
  // };

  const clearAddErrors = () => {
    setAddErrors({
      volume: "",
      mountPath: "",
    });
  };

  const handleAddVolume = () => {
    const nextErrors = {
      volume: "",
      mountPath: "",
    };

    if (!volume) {
      nextErrors.volume = "볼륨을 선택해 주세요.";
    }
    if (isEmpty(mountPath)) {
      nextErrors.mountPath = "Mount Path를 입력해 주세요.";
    }
    if (volume) {
      const isDuplicate = volumes.some((v) => v.volumeId === volume.volumeId);
      if (isDuplicate) {
        nextErrors.volume = "중복된 볼륨입니다.";
      }
    }

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setAddErrors(nextErrors);
      return;
    }

    if (!volume) {
      return;
    }

    const next: WorkloadVolumeType = {
      volumeId: volume.volumeId,
      mountPath: mountPath || "",
    };

    setVolumes((prev) => [...prev, next]);
    setVolumeInfoMap((prev) => ({
      ...prev,
      [volume.volumeId]: volume,
    }));
    setMountPath(null);
    setVolume(null);
    clearAddErrors();
  };

  const handleDeleteVolume = (volumeId: number) => {
    setVolumes((prev) => prev.filter((volume) => volume.volumeId !== volumeId));
    setVolumeInfoMap((prev) => {
      const { [volumeId]: _, ...next } = prev;
      return next;
    });
  };

  const handleMountPathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMountPath(e.target.value);
    if (e.target.value.trim() !== "") {
      setAddErrors((prev) => ({ ...prev, mountPath: "" }));
    }
  };

  const handleVolumeSelect = (
    nextVolume: SetStateAction<VolumeListResponse | null>,
  ) => {
    setVolume((prev) => {
      const resolved =
        typeof nextVolume === "function" ? nextVolume(prev) : nextVolume;
      if (resolved) {
        setAddErrors((prevErrors) => ({ ...prevErrors, volume: "" }));
      }
      return resolved;
    });
  };

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 볼륨 선택 시 마운트경로 정보 가져오기
  useEffect(() => {
    if (volume) {
      setMountPath(volume.mountPath || "");
    }
  }, [volume]);

  const volumeCards = volumes.map((item) => (
    <SelectedVolumeCard
      key={item.volumeId}
      item={item}
      volumeInfo={volumeInfoMap[item.volumeId]}
      onDelete={handleDeleteVolume}
    />
  ));

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle>볼륨</CreateWorkloadSectionTitle>
        {/* <CreateModelButton title="볼륨 생성" onClick={handleCreateVolume} /> */}
      </Header>
      <Body>
        <Row>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              볼륨 목록
            </Typography.Text>
            <VolumeSelect value={volume} setValue={handleVolumeSelect} />
            {addErrors.volume && (
              <ErrorMessage>{addErrors.volume}</ErrorMessage>
            )}
          </Pane>
          <Pane>
            <Label>
              <LabelTitle>Mount Path</LabelTitle>
              <GuideTooltip title={<VolumeMountPathTooltipTitle />} />
            </Label>
            <Input
              placeholder="Mount Path를 입력해 주세요."
              value={mountPath || ""}
              onChange={handleMountPathChange}
            />
            {addErrors.mountPath && (
              <ErrorMessage>{addErrors.mountPath}</ErrorMessage>
            )}
          </Pane>
        </Row>
        <AddButtonWrapper>
          <StyledAddButton
            variant="outlined"
            color="primary"
            onClick={handleAddVolume}
            icon="Plus"
            width="100%"
            height="30px"
            iconSize={20}
          >
            볼륨 추가
          </StyledAddButton>
        </AddButtonWrapper>
      </Body>

      {/* 선택된 볼륨 목록 */}
      <Footer>
        <FooterHeader>
          <Typography.Text variant="body-2-2" color="#484848">
            선택된 볼륨
          </Typography.Text>
          <IconWrapper
            className={classNames({ collapsed })}
            onClick={handleToggleCollapsed}
          >
            <Icon name="Dropdown" size={16} color="#222223" />
          </IconWrapper>
        </FooterHeader>

        {!collapsed && (
          <SelectedVolumeCardsContainer>
            {volumeCards}
            {volumes.length === 0 && (
              <EmptyVolumeMessage>
                <Typography.Text variant="body-2-4" color="#707070">
                  선택된 볼륨이 없습니다.
                </Typography.Text>
              </EmptyVolumeMessage>
            )}
          </SelectedVolumeCardsContainer>
        )}
      </Footer>
    </Container>
  );
}

interface SelectedVolumeCardProps {
  item: WorkloadVolumeType;
  volumeInfo?: WorkloadVolumeInfoUiType;
  onDelete: (volumeId: number) => void;
}

function SelectedVolumeCard({
  item,
  volumeInfo,
  onDelete,
}: SelectedVolumeCardProps) {
  const { text: storageTypeText } = getVolumeStorageTypeInfo(
    volumeInfo?.volumeType,
  );
  const { iconName } = getVisibilityInfo(volumeInfo?.isPublic);
  const sizeText = formatNumberWithUnit(volumeInfo?.fileSizeByte, "Byte");
  const title = volumeInfo?.volumeName ?? `-`;

  const handleDelete = () => {
    onDelete(item.volumeId);
  };

  return (
    <SelectedVolumeCardWrapper>
      <Card
        contentVariant="default"
        title={title}
        icon={
          iconName ? <Icon name={iconName} size={24} color="#464B51" /> : null
        }
        data-volume-id={item.volumeId}
        actionElement={
          <Button icon="Close" iconSize={14} onClick={handleDelete} />
        }
      >
        <SelectedVolumeCardContainer>
          <SelectedVolumeCardBody>
            <SelectedVolumeCardLeft>
              <SelectedVolumeCardKey>스토리지 타입</SelectedVolumeCardKey>
              <SelectedVolumeCardKey>경로</SelectedVolumeCardKey>
              <SelectedVolumeCardKey>볼륨 크기</SelectedVolumeCardKey>
            </SelectedVolumeCardLeft>
            <SelectedVolumeCardRight>
              <SelectedVolumeCardValue>
                {storageTypeText || "-"}
              </SelectedVolumeCardValue>
              <SelectedVolumeCardValue>
                <div className="truncate">{item.mountPath || "-"}</div>
              </SelectedVolumeCardValue>
              <SelectedVolumeCardValue>{sizeText}</SelectedVolumeCardValue>
            </SelectedVolumeCardRight>
          </SelectedVolumeCardBody>
        </SelectedVolumeCardContainer>
      </Card>
    </SelectedVolumeCardWrapper>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  position: relative;
`;

const LabelTitle = styled(Typography.Text).attrs({
  variant: "body-2-4",
  color: "#000000",
})`
  display: flex;
  align-items: center;`;

const Body = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AddButtonWrapper = styled.div`
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  gap: 8px;
  margin-top: 8px;
`;

const FooterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SelectedVolumeCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const EmptyVolumeMessage = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const SelectedVolumeCardWrapper = styled.div`
  .card-header {
    padding-right: 30px;
  }
`;

const SelectedVolumeCardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SelectedVolumeCardBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

const SelectedVolumeCardLeft = styled.div`
  width: 65px;
  border-right: 1px solid #e9ebee;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SelectedVolumeCardKey = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #484848;
  word-spacing: 0.1px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const SelectedVolumeCardRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 10px;
`;

const SelectedVolumeCardValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  flex: 1;
`;

const StyledAddButton = styled(Button)`
  font-size: 12px !important;
`;

const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  &.collapsed {
    transform: rotate(180deg);
  }
`;

const ErrorMessage = styled.div`
  ${errorTextStyle}
`;
