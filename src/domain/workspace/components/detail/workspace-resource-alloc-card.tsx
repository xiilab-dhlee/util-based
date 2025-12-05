"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import type { ResourceAllocationData } from "@/domain/workspace/components/detail/update-resource-allocation-modal";
import { UpdateResourceAllocationModal } from "@/domain/workspace/components/detail/update-resource-allocation-modal";
import { useGetWorkspace } from "@/domain/workspace/hooks/use-get-workspace";
import { Slider } from "@/shared/components/slider";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 워크스페이스 리소스 할당량 카드 컴포넌트
 *
 * 워크스페이스의 리소스 할당량 정보를 표시하고 수정할 수 있습니다.
 * GPU, CPU, MEM의 할당량을 프로그레스 바와 입력 필드로 보여주며,
 * MIG(Multi-Instance GPU) 설정도 포함합니다.
 */
export function WorkspaceResourceAllocCard() {
  const { id } = useParams();
  const publish = usePublish();
  const { data: workspaceData } = useGetWorkspace(id as string);

  const gpuValue = workspaceData?.gpu ?? 0;
  const gpuLimit = workspaceData?.gpuQuota ?? 0;
  const cpuValue = workspaceData?.cpu ?? 0;
  const cpuLimit = workspaceData?.cpuQuota ?? 0;
  const memValue = workspaceData?.mem ?? 0;
  const memLimit = workspaceData?.memQuota ?? 0;

  /**
   * 수정 버튼 클릭 핸들러
   * PubSub을 통해 리소스 할당량 수정 모달에 데이터를 전달합니다.
   */
  const handleClickEdit = () => {
    if (!workspaceData) return;

    const resourceData: ResourceAllocationData = {
      gpuValue: workspaceData.gpu,
      gpuLimit: workspaceData.gpuQuota,
      cpuValue: workspaceData.cpu,
      cpuLimit: workspaceData.cpuQuota,
      memValue: workspaceData.mem,
      memLimit: workspaceData.memQuota,
      // TODO: MIG 리소스는 별도 API 또는 필드가 추가되면 매핑 처리
      migResources: [],
    };
    publish(WORKSPACE_EVENTS.sendUpdateResourceAllocation, resourceData);
  };

  return (
    <>
      {/* 리소스 할당량 카드 컨테이너 */}
      <Container>
        {/* 카드 헤더: 제목과 편집 버튼 */}
        <Header>
          <Title>리소스 할당량</Title>
          <div>
            <span className="sr-only">리소스 할당량 수정</span>
          </div>
          <Button
            icon="Edit02"
            width={26}
            height={26}
            iconSize={20}
            onClick={handleClickEdit}
          />
        </Header>

        {/* 기본 리소스 할당량 섹션 */}
        <Body>
          <Resources>
            {/* GPU 리소스 할당량 */}
            <Resource>
              <ResourceKey>{getResourceInfo("GPU").text}</ResourceKey>
              <Slider
                min={0}
                max={gpuLimit}
                value={gpuValue}
                type="GPU"
                width="100%"
                readMode
                showInput={true}
              />
            </Resource>
            {/* CPU 리소스 할당량 */}
            <Resource>
              <ResourceKey>{getResourceInfo("CPU").text}</ResourceKey>
              <Slider
                min={0}
                max={cpuLimit}
                value={cpuValue}
                type="CPU"
                width="100%"
                readMode
                showInput={true}
              />
            </Resource>
            {/* MEM 리소스 할당량 */}
            <Resource>
              <ResourceKey>{getResourceInfo("MEM").text}</ResourceKey>
              <Slider
                min={0}
                max={memLimit}
                value={memValue}
                type="MEM"
                width="100%"
                readMode
                showInput={true}
              />
            </Resource>
          </Resources>
        </Body>

        {/* MIG(Multi-Instance GPU) 설정 섹션 */}
        <Body>
          <BodyHeader>
            <BodyHeaderTitle>
              <span>{getResourceInfo("GPU").text}</span>
              <BodyHeaderTitleDivdier />
              <span>{getResourceInfo("MIG").text}</span>
            </BodyHeaderTitle>
          </BodyHeader>
          <Resources>
            {/* 1g.12gb MIG 설정 */}
            <Resource>
              <ResourceKey>1g.12gb</ResourceKey>
              <Slider
                min={0}
                max={5}
                value={4}
                type="MIG"
                width="100%"
                readMode
                showInput={true}
              />
            </Resource>

            {/* 2g.24gb MIG 설정 */}
            <Resource>
              <ResourceKey>2g.24gb</ResourceKey>
              <Slider
                min={0}
                max={5}
                value={4}
                type="MIG"
                width="100%"
                readMode
                showInput={true}
              />
            </Resource>
          </Resources>
        </Body>
      </Container>

      {/* 리소스 할당량 수정 모달 */}
      <UpdateResourceAllocationModal />
    </>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * 리소스 할당량 카드 메인 컨테이너
 * 카드의 전체 레이아웃과 스타일을 정의합니다.
 */
const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 7px;
  padding-top: 1px;
  background-color: #fcfcfc;
  padding: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);

  --border-color: #e0e0e0;
`;

/**
 * 카드 헤더 스타일
 * 제목과 편집 버튼을 좌우로 배치합니다.
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * 카드 제목 스타일
 * "리소스 할당량" 텍스트의 스타일을 정의합니다.
 */
const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  height: 16px;
`;

const Body = styled.div`
  flex: 1;
  border: 1px solid #d1d5dc;
  background-color: #fafafa;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  --border-color: #d1d5dc;

  & + & {
    margin-top: 3px;
  }
`;

const BodyHeader = styled.div`
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 10px;
`;

const BodyHeaderTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const BodyHeaderTitleDivdier = styled.div`
  width: 1.5px;
  height: 10px;
  background-color: var(--border-color);
`;

const Resources = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Resource = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  gap: 6px;
`;

const ResourceKey = styled.div`
  color: #000;
  width: 45px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
