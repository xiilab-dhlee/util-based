"use client";

import classNames from "classnames";
import { isEmpty } from "es-toolkit/compat";
import { useAtom } from "jotai";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Icon, Input, Typography } from "xiilab-ui";

import type {
  VolumeListResponse,
  WorkloadVolumeDetail,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { VolumeSelect } from "@/domain/volume/components/volume-select";
import { workloadVolumesAtom } from "@/domain/workload/state/create-workload.atom";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { WorkloadVolumeCard } from "@/shared/components/card/workload-volume-card";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { VolumeMountPathTooltipTitle } from "@/shared/components/tooltip-title/volume-mount-path-tooltip-title";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

export function CreateWorkloadVolume() {
  const [volumes, setVolumes] = useAtom(workloadVolumesAtom);

  const [collapsed, setCollapsed] = useState(false);

  const [volume, setVolume] = useState<VolumeListResponse | null>(null);

  const [mountPath, setMountPath] = useState<string | null>(null);

  const publish = usePublish();
  const handleCreateVolume = () => {
    publish(VOLUME_EVENTS.openSelectStorageTypeModal);
  };

  const handleAddVolume = () => {
    if (volume) {
      if (isEmpty(mountPath)) {
        toast.error("마운트 경로를 입력해 주세요.");
        return;
      }

      // VolumeListResponse를 WorkloadVolumeDetail으로 변환
      const next: WorkloadVolumeDetail = {
        volumeId: volume.volumeId,
        volumeName: volume.volumeName,
        volumeType: volume.volumeType,
        mountPath: mountPath || "",
        volumeSize: volume.fileSizeByte,
      };

      setVolumes([...volumes, next]);
      setMountPath(null);
    } else {
      toast.error("볼륨을 선택해 주세요.");
    }
  };

  const handleDeleteVolume = (volumeId: number) => {
    setVolumes(volumes.filter((volume) => volume.volumeId !== volumeId));
  };

  const handleMountPathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMountPath(e.target.value);
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

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle>볼륨</CreateWorkloadSectionTitle>
        <CreateModelButton title="볼륨 생성" onClick={handleCreateVolume} />
      </Header>
      {/* 소스코드 추가 영역 */}
      <Body>
        {/* 소스코드 목록과 Branch */}
        <Row>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              볼륨 목록
            </Typography.Text>
            <VolumeSelect value={volume} setValue={setVolume} />
          </Pane>
          <Pane>
            <Label>
              <LabelTitle>마운트 경로</LabelTitle>
              <GuideTooltip title={<VolumeMountPathTooltipTitle />} />
            </Label>
            <Input
              placeholder="Mount Path를 입력해 주세요."
              value={mountPath || ""}
              onChange={handleMountPathChange}
            />
          </Pane>
        </Row>
        {/* 소스코드 추가 버튼 */}
        <VolumeAddButtonWrapper>
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
        </VolumeAddButtonWrapper>
      </Body>

      {/* 소스코드 목록 박스 */}
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
          <SourceCodeCardsContainer>
            {volumes.map((volume) => (
              <WorkloadVolumeCard
                key={volume.volumeId}
                {...volume}
                onDelete={() => handleDeleteVolume(volume.volumeId)}
              />
            ))}
            {volumes.length === 0 && (
              <EmptyVolumeMessage>
                <Typography.Text variant="body-2-4" color="#707070">
                  선택된 볼륨이 없습니다.
                </Typography.Text>
              </EmptyVolumeMessage>
            )}
          </SourceCodeCardsContainer>
        )}
      </Footer>
    </Container>
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
  align-items: end;
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

const VolumeAddButtonWrapper = styled.div`
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

const SourceCodeCardsContainer = styled.div`
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
