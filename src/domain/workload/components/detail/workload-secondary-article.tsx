"use client";

import { format } from "date-fns";
import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { WorkloadSourcecodeCard } from "@/domain/sourcecode/components/workload-sourcecode-card";
import { workloadEnvColumn } from "@/domain/workload/components/detail/workload-env-column";
import { workloadPortColumn } from "@/domain/workload/components/detail/workload-port-column";
import { useGetWorkloadByMode } from "@/domain/workload/hooks/use-get-workload-by-mode";
import { getWorkloadImageTypeInfo } from "@/domain/workload/utils/workload.util";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { WorkloadVolumeCard } from "@/shared/components/card/workload-volume-card";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SecurityLevelText } from "@/shared/components/text/security-status-text";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  DetailContentArticle,
  DetailContentKey,
  DetailContentSubTitle,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 추가 정보 아티클 컴포넌트
 *
 * 워크로드 이미지, 환경 변수, 포트, 소스코드, 볼륨, 생성자, 생성일을 표시합니다
 */
export function WorkloadSecondaryArticle() {
  const publish = usePublish();

  const { id } = useParams();
  const searchParams = useSearchParams();

  // hooks는 항상 최상위에서 호출
  const { data } = useGetWorkloadByMode({
    workspaceId: Number(searchParams?.get("workspaceId")),
    workloadId: String(id),
  });

  const handleClickCommitImage = () => {
    publish(WORKLOAD_EVENTS.sendCommitImage, data);
  };

  const { label, icon } = getWorkloadImageTypeInfo(data?.image.type);

  return (
    <Container>
      <Pane>
        {/* 이미지 영역 */}
        <DetailContentSubTitle>이미지</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <ImageKey>이미지</ImageKey>
          <Value>
            <ImageName data-testid={WORKLOAD_SELECTOR.DETAIL_IMAGE_TYPE}>
              <IconWrapper>
                <Icon name={icon} color="var(--icon-fill)" size={18} />
              </IconWrapper>
              {label}
            </ImageName>
            <div>
              <Code data-testid={WORKLOAD_SELECTOR.DETAIL_IMAGE_NAME}>
                {data?.image.name}
              </Code>
            </div>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="connect">
          <LeftKey>내부 레지스트리</LeftKey>
          <Value>
            <CreateModelButton
              onClick={handleClickCommitImage}
              title="Commit Image 생성"
              data-testid={WORKLOAD_SELECTOR.DETAIL_COMMIT_IMAGE_BUTTON}
            />
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="split">
          <LeftKey>보안검사 결과</LeftKey>
          <Value>
            <SecurityStatuses>
              <SecurityLevelText type="engText" status="CRITICAL">
                <SecurityCount
                  data-testid={WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_CRITICAL}
                >
                  {data?.scanResult?.critical?.toLocaleString() || "-"}개
                </SecurityCount>
              </SecurityLevelText>
              <SecurityLevelText type="engText" status="HIGH">
                <SecurityCount
                  data-testid={WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_HIGH}
                >
                  {data?.scanResult?.high?.toLocaleString() || "-"}개
                </SecurityCount>
              </SecurityLevelText>
              <SecurityLevelText type="engText" status="MEDIUM">
                <SecurityCount
                  data-testid={WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_MEDIUM}
                >
                  {data?.scanResult?.medium?.toLocaleString() || "-"}개
                </SecurityCount>
              </SecurityLevelText>
              <SecurityLevelText type="engText" status="LOW">
                <SecurityCount
                  data-testid={WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_LOW}
                >
                  {data?.scanResult?.low?.toLocaleString() || "-"}개
                </SecurityCount>
              </SecurityLevelText>
            </SecurityStatuses>
          </Value>
        </KeyValueContainer>
        {/* <DetailContentSubTitle>Output</DetailContentSubTitle>
        <KeyValueContainer className="split">
          <LeftKey>Output 경로</LeftKey>
          <Value>
            <Text>
              python train.py --save_model_dir=/input/ASTRAGO
              --data_dir=/tmp/test/data.yaml --image_size=640 --batch=16
              --epoch=120 --learning_rate=0.01
            </Text>
          </Value>
        </KeyValueContainer> */}
        <DetailContentSubTitle>실행 경로, 실행 명령어</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <LeftKey>실행 경로</LeftKey>
          <Value>
            <Text data-testid={WORKLOAD_SELECTOR.DETAIL_EXEC_PATH}>
              {data?.execPath || "-"}
            </Text>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="split">
          <LeftKey>실행 명령어</LeftKey>
          <Value>
            <Text data-testid={WORKLOAD_SELECTOR.DETAIL_EXEC_COMMAND}>
              {data?.execCommand || "-"}
            </Text>
          </Value>
        </KeyValueContainer>
        <DetailContentSubTitle>환경 변수</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <CustomizedTable
            columns={workloadEnvColumn}
            data={data?.envs || []}
            headerHeight={26}
            columnHeight={32}
            bodyBgColor="transparent"
            activePadding
          />
        </KeyValueContainer>
        <DetailContentSubTitle>포트</DetailContentSubTitle>
        <KeyValueContainer className="split">
          <CustomizedTable
            columns={workloadPortColumn}
            data={data?.ports || []}
            headerHeight={26}
            columnHeight={32}
            bodyBgColor="transparent"
            activePadding
          />
        </KeyValueContainer>
        <DetailContentSubTitle>생성 정보</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <LeftKey>생성자</LeftKey>
          <Value>
            <Text data-testid={WORKLOAD_SELECTOR.DETAIL_CREATOR}>
              {data?.creatorName || "-"}
            </Text>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="connect">
          <LeftKey>생성일</LeftKey>
          <Value>
            <Text data-testid={WORKLOAD_SELECTOR.DETAIL_CREATED_DATE}>
              {data?.creatorDate
                ? format(data?.creatorDate, "yyyy.MM.dd")
                : "-"}
            </Text>
          </Value>
        </KeyValueContainer>
      </Pane>
      <Pane>
        <DetailContentSubTitle>리소스</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <RightKey>선택한 GPU</RightKey>
          <Value>
            <Codes>
              <Code>
                <span data-testid={WORKLOAD_SELECTOR.DETAIL_GPU_TYPE}>
                  {data?.gpuType || ""}
                </span>
                &nbsp;|&nbsp;
                <span data-testid={WORKLOAD_SELECTOR.DETAIL_GPU_NAME}>
                  {data?.gpuName || ""}
                </span>
              </Code>
              <Code>
                GPU-MEM |&nbsp;
                <span data-testid={WORKLOAD_SELECTOR.DETAIL_GPU_MEMORY_GB}>
                  {data?.gpuMemoryGb ?? ""}
                </span>
                GB
              </Code>
            </Codes>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="split">
          <RightKey>리소스</RightKey>
          <Value>
            <Resources>
              <Resource>
                GPU
                <ResourceCount>
                  <span data-testid={WORKLOAD_SELECTOR.DETAIL_GPU_COUNT}>
                    {data?.gpuCount ?? ""}
                  </span>
                  개
                </ResourceCount>
              </Resource>
              <Resource>
                CPU
                <ResourceCount>
                  <span data-testid={WORKLOAD_SELECTOR.DETAIL_CPU_CORE}>
                    {data?.cpuCore ?? ""}
                  </span>
                  Core
                </ResourceCount>
              </Resource>
              <Resource>
                MEM
                <ResourceCount>
                  <span data-testid={WORKLOAD_SELECTOR.DETAIL_MEMORY_GB}>
                    {data?.memoryGb ?? ""}
                  </span>
                  GB
                </ResourceCount>
              </Resource>
            </Resources>
          </Value>
        </KeyValueContainer>
        <DetailContentSubTitle>소스코드, 볼륨</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <RightKey>소스코드</RightKey>
          <Value>
            {data?.sourcecodes.map((v) => (
              <WorkloadSourcecodeCard key={v.sourceCodeId} {...v} />
            ))}
          </Value>
        </KeyValueContainer>
        <KeyValueContainer>
          <RightKey>볼륨</RightKey>
          <Value>
            {data?.volumes.map((v) => (
              <WorkloadVolumeCard key={v.uid} {...v} />
            ))}
          </Value>
        </KeyValueContainer>
      </Pane>
    </Container>
  );
}

const Container = styled(DetailContentArticle)`
  flex: 1;
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow-y: auto;
  overflow-x: hidden;
  
  & > div:first-child {
    border-right: 1px solid #e0e0e0;
  }
`;

const Pane = styled.div`
  padding: 0px 17px;
  grid-column: span 1;
  min-width: 0;
`;

const IconWrapper = styled.div`
  width: 13px;
  height: 18px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  --icon-fill: #000;
`;

const KeyValueContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;

  &.connect {
    margin-bottom: 10px;
  }

  &.split {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
`;

const Value = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`;

const Text = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #22212a;
`;

const LeftKey = styled(DetailContentKey)`
  width: 100px;
`;

const ImageKey = styled(LeftKey)`
  padding-top: 3px;
`;

const RightKey = styled(DetailContentKey)`
  width: 80px;
`;

const ImageName = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #22212a;
`;

const Code = styled.div`
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  padding: 7px 10px;
  color: #333845;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  border-radius: 2px;
  display: inline-block;
`;

const SecurityStatuses = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const SecurityCount = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #22212a;
  margin-left: 4px;
`;

const ResourceCount = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #22212a;
`;

const Codes = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const Resources = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const Resource = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #22212a;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;
