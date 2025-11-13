"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { Button, Label } from "xiilab-ui";

import { useGetNode } from "@/hooks/node/use-get-node";
import {
  DetailContentHeader,
  DetailContentKey,
  DetailContentSubTitle,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";
import {
  DetailContentFeature,
  DetailContentFeatureBody,
  DetailContentFeatureGridBody,
  DetailContentFeaturePane,
  DetailContentFeatureRow,
  DetailContentPane,
  DetailContentPaneBody,
  DetailContentPaneValue,
} from "@/styles/layers/detail-page-vertical-layers.styled";
import type { NodeCondition } from "@/types/node/node.model";
import NodeConditionCard from "./node-condition-card";

/**
 * NodePrimaryPane 컴포넌트
 *
 * 노드 상세 페이지의 주요 정보를 표시하는 패널 컴포넌트입니다.
 * 노드의 기본 정보, 시스템 정보, 상태 정보를 포함하여 노드의 핵심 정보를
 * 한눈에 볼 수 있도록 구성되어 있습니다.
 *
 * @returns 노드의 주요 정보를 표시하는 패널 컴포넌트
 */
export function NodePrimaryPane() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  // Redfish 기능 활성화 여부 (현재 비활성화)
  const isRedfish = false;

  return (
    <DetailContentPane>
      {/* 노드 자원 상세정보 헤더 */}
      <DetailContentHeader>
        <DetailContentTitle>노드 자원 상세정보</DetailContentTitle>
      </DetailContentHeader>
      <DetailContentPaneBody>
        {/* Redfish 기능이 활성화된 경우 서버 전원 관리 섹션 표시 */}
        {isRedfish && (
          <>
            <DetailContentSubTitle>Server</DetailContentSubTitle>
            <KeyValueContainer>
              <ServerKey>Server Power Status</ServerKey>
              <Label size="medium" theme="light" variant="blue">
                전원 ON
              </Label>
            </KeyValueContainer>
            <PowerButtonWrapper>
              <Button
                color="primary"
                icon="PowerBold"
                iconPosition="left"
                iconSize={16}
                size="medium"
                variant="outlined"
                height={32}
                width="100%"
                onClick={() => alert("미구현")}
              >
                전원 종료
              </Button>
            </PowerButtonWrapper>
          </>
        )}

        {/* 노드 기본 정보 섹션 */}
        <DetailContentFeature className={!isRedfish ? "first" : ""}>
          <DetailContentSubTitle>Node Information</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* 노드 기본 정보 (이름, IP, 호스트명) */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Node Name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeName}
                >
                  {data?.node.nodeName}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Internal IP</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.ip}
                >
                  {data?.node.ip}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Host Name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.hostName}
                >
                  {data?.node.hostName}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 노드 역할 및 생성 시간 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Roles</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.role}
                >
                  {data?.node.role}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Creation Timestamp</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={
                    data && format(data.node.creationTimestamp, "yyyy.MM.dd")
                  }
                >
                  {data && format(data.node.creationTimestamp, "yyyy.MM.dd")}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow></DetailContentFeatureRow>
            </DetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
        {/* 노드 시스템 정보 섹션 */}
        <DetailContentFeature>
          <DetailContentSubTitle>Information</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* 시스템 기본 정보 (Machine ID, System UUID, Boot ID, Kernel Version, OS Image) */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Machine ID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.machineID}
                >
                  {data?.node.nodeSystemInfo?.machineID}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>System UUID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.systemUUID}
                >
                  {data?.node.nodeSystemInfo?.systemUUID}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Boot ID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.bootID}
                >
                  {data?.node.nodeSystemInfo?.bootID}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kernel Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.kernelVersion}
                >
                  {data?.node.nodeSystemInfo?.kernelVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>OS Image</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.osImage}
                >
                  {data?.node.nodeSystemInfo?.osImage}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 운영체제 및 런타임 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Operating System</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.operatingSystem}
                >
                  {data?.node.nodeSystemInfo?.operatingSystem}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Container Runtime Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.containerRuntimeVersion}
                >
                  {data?.node.nodeSystemInfo?.containerRuntimeVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kubelet Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.kubeletVersion}
                >
                  {data?.node.nodeSystemInfo?.kubeletVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kube-Proxy Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.node.nodeSystemInfo?.kubeProxyVersion}
                >
                  {data?.node.nodeSystemInfo?.kubeProxyVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow></DetailContentFeatureRow>
            </DetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
        {/* 노드 상태 정보 섹션 */}
        <DetailContentFeature className="last">
          <DetailContentSubTitle>Conditions</DetailContentSubTitle>
          <DetailContentFeatureGridBody>
            {/* 노드 상태 카드들을 그리드 형태로 표시 */}
            {data?.node.nodeCondition.map(
              (condition: NodeCondition, index: number) => (
                <NodeConditionCard key={index} {...condition} />
              ),
            )}
          </DetailContentFeatureGridBody>
        </DetailContentFeature>
      </DetailContentPaneBody>
    </DetailContentPane>
  );
}


/**
 * 서버 전원 상태 키 스타일
 * Redfish 기능에서 서버 전원 상태를 표시하는 키의 스타일입니다.
 */
const ServerKey = styled(DetailContentKey)`
  width: 120px;
`;

/**
 * 전원 버튼 래퍼 스타일
 * 서버 전원 종료 버튼을 감싸는 컨테이너의 스타일입니다.
 */
const PowerButtonWrapper = styled.div`
  margin-top: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

/**
 * 키-값 컨테이너 스타일
 * 서버 전원 상태 정보를 표시하는 키-값 쌍의 컨테이너 스타일입니다.
 */
const KeyValueContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
`;
