"use client";

import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { useGetAdminWorkspaceDetail } from "@/api/generated/admin-workspace/admin-workspace";
import {
  useGetClusterTotalResources,
  useGetMigProfiles,
} from "@/api/generated/cluster-resource/cluster-resource";
import { UpdateResourceAllocationModal } from "@/domain/workspace/components/detail/update-resource-allocation-modal";
import { openUpdateResourceAllocationModalAtom } from "@/domain/workspace/state/workspace.atom";
import { Slider } from "@/shared/components/slider";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 실제 API 응답 구조 (타입 정의와 실제 응답이 다름)
 */
interface ActualResourceResponse {
  gpu?: {
    quotaCount?: number;
    usedCount?: number;
    requestCount?: number;
    utilization?: number;
    detail?: {
      normal?: {
        quotaCount?: number;
        usedCount?: number;
        requestCount?: number;
      };
      mig?: Array<{
        profile: string;
        quotaCount?: number;
        usedCount?: number;
        requestCount?: number;
      }>;
    };
  };
  cpu?: {
    quotaCore?: number;
    usedCore?: number;
    requestCore?: number;
    utilization?: number;
  };
  memory?: {
    quotaByte?: number;
    usedByte?: number;
    requestByte?: number;
    utilization?: number;
  };
}

/**
 * 워크스페이스 리소스 할당량 카드 컴포넌트
 *
 * 워크스페이스의 리소스 할당량 정보를 표시하고 수정할 수 있습니다.
 * GPU, CPU, MEM의 할당량을 프로그레스 바와 입력 필드로 보여주며,
 * MIG(Multi-Instance GPU) 설정도 포함합니다.
 */
export function WorkspaceResourceAllocCard() {
  const setOpen = useSetAtom(openUpdateResourceAllocationModalAtom);
  const { id } = useParams<{ id: string }>();
  const workspaceId = Number(id);
  const isValidWorkspaceId = Number.isFinite(workspaceId);

  const { data: clusterResources } = useGetClusterTotalResources();
  const { data: migProfiles } = useGetMigProfiles();
  const {
    data: workspaceDetail,
    isLoading: isLoadingWorkspaceQuota,
    isError: isErrorWorkspaceQuota,
  } = useGetAdminWorkspaceDetail(workspaceId, {
    query: {
      enabled: isValidWorkspaceId,
    },
  });

  const workspaceQuotaData = workspaceDetail?.resource as
    | ActualResourceResponse
    | undefined;

  const gpuValue = workspaceQuotaData?.gpu?.detail?.normal?.quotaCount ?? 0;
  const cpuValue = workspaceQuotaData?.cpu?.quotaCore ?? 0;
  const memValue = convertBytes(
    workspaceQuotaData?.memory?.quotaByte ?? 0,
    "GB",
    0,
  ).value;

  const gpuLimit = clusterResources?.gpu?.clusterCapacityCount ?? gpuValue;
  const cpuLimit = clusterResources?.cpu?.clusterCapacityCores ?? cpuValue;
  const memLimit = convertBytes(
    Number(clusterResources?.memory?.clusterCapacityBytes ?? 0),
    "GB",
    0,
  ).value;

  const migResources = workspaceQuotaData?.gpu?.detail?.mig ?? [];

  const migProfileMaxMap = useMemo(
    () =>
      new Map(
        (migProfiles?.migProfiles ?? []).map((profile) => [
          profile.profile,
          profile.maxCount,
        ]),
      ),
    [migProfiles],
  );

  const migResourceItems = useMemo(
    () =>
      migResources
        .filter(
          (mig) =>
            mig.quotaCount != null &&
            Number.isFinite(mig.quotaCount) &&
            mig.quotaCount > 0,
        )
        .map((mig) => {
          const quotaCount = mig.quotaCount ?? 0;
          return {
            name: mig.profile,
            value: quotaCount,
            limit: migProfileMaxMap.get(mig.profile) ?? quotaCount,
          };
        }),
    [migProfileMaxMap, migResources],
  );

  const migResourceElements = useMemo(
    () =>
      migResourceItems.map((mig) => (
        <Resource key={mig.name}>
          <ResourceKey>{mig.name}</ResourceKey>
          <Slider
            min={0}
            max={mig.limit}
            value={mig.value}
            type="MIG"
            width="100%"
            readMode
            showInput={true}
          />
        </Resource>
      )),
    [migResourceItems],
  );

  /**
   * 수정 버튼 클릭 핸들러
   * 모달을 엽니다. 모달은 자체적으로 API를 호출하여 데이터를 가져옵니다.
   */
  const handleClickEdit = () => {
    setOpen(true);
  };

  if (isLoadingWorkspaceQuota) {
    return (
      <Container>
        <Header>
          <Title>리소스 할당량</Title>
        </Header>
        <Body>
          <LoadingMessage>리소스 할당량 로딩 중...</LoadingMessage>
        </Body>
      </Container>
    );
  }

  if (isErrorWorkspaceQuota || !workspaceQuotaData) {
    return (
      <Container>
        <Header>
          <Title>리소스 할당량</Title>
        </Header>
        <Body>
          <ErrorMessage>
            리소스 할당량 정보를 불러오는데 실패했습니다.
          </ErrorMessage>
        </Body>
      </Container>
    );
  }

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

        {migResourceItems.length > 0 && (
          <Body>
            <BodyHeader>
              <BodyHeaderTitle>
                <span>{getResourceInfo("GPU").text}</span>
                <BodyHeaderTitleDivdier />
                <span>{getResourceInfo("MIG").text}</span>
              </BodyHeaderTitle>
            </BodyHeader>
            <Resources>{migResourceElements}</Resources>
          </Body>
        )}
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

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #d32f2f;
  font-size: 14px;
`;
