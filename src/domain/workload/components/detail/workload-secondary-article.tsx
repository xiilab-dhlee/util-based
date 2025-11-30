"use client";

import { format } from "date-fns";
import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { workloadEnvColumn } from "@/domain/workload/components/detail/workload-env-column";
import { workloadPortColumn } from "@/domain/workload/components/detail/workload-port-column";
import { useGetWorkloadByMode } from "@/domain/workload/hooks/use-get-workload-by-mode";
import { getWorkloadImageTypeInfo } from "@/domain/workload/utils/workload.util";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { BuiltinIcon } from "@/shared/components/icon/builtin-icon";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SecurityLevelText } from "@/shared/components/text/security-status-text";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  DetailContentArticle,
  DetailContentKey,
  DetailContentSubTitle,
} from "@/styles/layers/detail-page-layers.styled";
import { WorkloadSourcecodeCard } from "../../../sourcecode/components/workload-sourcecode-card";
import { WorkloadVolumeCard } from "../../../volume/components/workload-volume-card";

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
    workspaceId: String(searchParams?.get("workspaceId")),
    workloadId: String(id),
  });

  const handleClickCommitImage = () => {
    publish(WORKLOAD_EVENTS.sendCommitImage, data);
  };

  const { label } = getWorkloadImageTypeInfo(data?.image.type);

  return (
    <Container>
      <Pane>
        {/* 이미지 영역 */}
        <DetailContentSubTitle>이미지</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <LeftKey>이미지</LeftKey>
          <Value>
            <ImageName>
              <IconWrapper>
                <BuiltinIcon />
              </IconWrapper>
              {label} Image
            </ImageName>
            <div>
              <Code>{data?.image.name}</Code>
            </div>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="connect">
          <LeftKey>내부 레지스트리</LeftKey>
          <Value>
            <CreateModelButton
              onClick={handleClickCommitImage}
              title="Commit Image 생성"
            />
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="split">
          <LeftKey>보안 검증</LeftKey>
          <SecurityValue>
            <SecurityStatuses>
              <SecurityLevelText status="CRITICAL">
                <SecurityCount>7,777개</SecurityCount>
              </SecurityLevelText>
              <SecurityLevelText status="HIGH">
                <SecurityCount>7,777개</SecurityCount>
              </SecurityLevelText>
              <SecurityLevelText status="LOW">
                <SecurityCount>7,777개</SecurityCount>
              </SecurityLevelText>
            </SecurityStatuses>
          </SecurityValue>
        </KeyValueContainer>
        <DetailContentSubTitle>Output</DetailContentSubTitle>
        <KeyValueContainer className="split">
          <LeftKey>Output 경로</LeftKey>
          <Value>
            <Text>
              python train.py --save_model_dir=/input/ASTRAGO
              --data_dir=/tmp/test/data.yaml --image_size=640 --batch=16
              --epoch=120 --learning_rate=0.01
            </Text>
          </Value>
        </KeyValueContainer>
        <DetailContentSubTitle>실행 경로, 실행 명령어</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <LeftKey>실행 경로</LeftKey>
          <Value>
            <Text>python train.py -</Text>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="split">
          <LeftKey>실행 명령어</LeftKey>
          <Value>
            <Text>
              python train.py --save_model_dir=/input/ASTRAGO
              --data_dir=/tmp/test/data.yaml --image_size=640 --batch=16
              --epoch=120 --learning_rate=0.01
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
            <Text>{data?.creatorName}</Text>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="connect">
          <LeftKey>생성일</LeftKey>
          <Value>
            <Text>
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
              <Code>MPS | Tesla-V100-PCIE-32GB-SHARED</Code>
              <Code>vs-code:torch2.0.1-tensorflow2.11.0-cuda11.7</Code>
            </Codes>
          </Value>
        </KeyValueContainer>
        <KeyValueContainer className="split">
          <RightKey>리소스</RightKey>
          <Value>
            <Resources>
              <Resource>
                GPU<ResourceCount>7,777개</ResourceCount>
              </Resource>
              <Resource>
                CPU<ResourceCount>7,777Core</ResourceCount>
              </Resource>
              <Resource>
                MEM<ResourceCount>7,777GB</ResourceCount>
              </Resource>
            </Resources>
          </Value>
        </KeyValueContainer>
        <DetailContentSubTitle>소스코드, Volume</DetailContentSubTitle>
        <KeyValueContainer className="connect">
          <RightKey>소스코드</RightKey>
          <Value>
            {data?.sourcecodes.map((v) => (
              <WorkloadSourcecodeCard key={v.id} {...v} />
            ))}
          </Value>
        </KeyValueContainer>
        <KeyValueContainer>
          <RightKey>Volume</RightKey>
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

  & > div:first-child {
    border-right: 1px solid #e0e0e0;
  }
`;

const Pane = styled.div`
  flex: 1;
  padding: 0px 17px;
  overflow-x: hidden;
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

const SecurityValue = styled(Value)`
  padding-top: 2px;
  padding-left: 10px;
`;

const Text = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #22212a;
`;

const LeftKey = styled(DetailContentKey)`
  width: 100px;
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
