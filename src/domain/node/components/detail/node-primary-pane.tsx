"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { Label } from "xiilab-ui";

import { useGetNode } from "@/domain/node/hooks/use-get-node";
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
import { NodeConditionCard } from "./node-condition-card";

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
  const isRedfish = true;
  const powerStatus = "ON";

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
              {powerStatus === "ON" ? (
                <Label size="medium" theme="light" variant="blue">
                  전원 ON
                </Label>
              ) : (
                <Label size="medium" theme="light" variant="black">
                  전원 OFF
                </Label>
              )}
            </KeyValueContainer>
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
                  title={data?.nodeName}
                >
                  {data?.nodeName}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Internal IP</DetailContentKey>
                <DetailContentPaneValue className="truncate" title={data?.ip}>
                  {data?.ip}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Host Name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.hostName}
                >
                  {data?.hostName}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 노드 역할 및 생성 시간 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Roles</DetailContentKey>
                <DetailContentPaneValue className="truncate" title={data?.role}>
                  {data?.role}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Creation Timestamp</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data && format(data.creationTimestamp, "yyyy.MM.dd")}
                >
                  {data && format(data.creationTimestamp, "yyyy.MM.dd")}
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
                  title={data?.nodeSystemInfo?.machineID}
                >
                  {data?.nodeSystemInfo?.machineID}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>System UUID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.systemUUID}
                >
                  {data?.nodeSystemInfo?.systemUUID}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Boot ID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.bootID}
                >
                  {data?.nodeSystemInfo?.bootID}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kernel Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.kernelVersion}
                >
                  {data?.nodeSystemInfo?.kernelVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>OS Image</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.osImage}
                >
                  {data?.nodeSystemInfo?.osImage}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 운영체제 및 런타임 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Operating System</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.operatingSystem}
                >
                  {data?.nodeSystemInfo?.operatingSystem}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Container Runtime Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.containerRuntimeVersion}
                >
                  {data?.nodeSystemInfo?.containerRuntimeVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kubelet Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.kubeletVersion}
                >
                  {data?.nodeSystemInfo?.kubeletVersion}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kube-Proxy Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.kubeProxyVersion}
                >
                  {data?.nodeSystemInfo?.kubeProxyVersion}
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
            {data?.nodeCondition.map((condition) => (
              <NodeConditionCard key={condition.reason} {...condition} />
            ))}
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
 * 키-값 컨테이너 스타일
 * 서버 전원 상태 정보를 표시하는 키-값 쌍의 컨테이너 스타일입니다.
 */
const KeyValueContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  height: 42px;
  padding: 0 14px;

`;
