"use client";

import type { ClusterNodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NodeConditionCard } from "@/domain/node/components/detail/node-condition-card";
import { formatDateSafely } from "@/shared/utils/date.util";
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

interface NodePrimaryPaneProps {
  data?: ClusterNodeDetailResponse;
}

/**
 * NodePrimaryPane 컴포넌트
 *
 * 노드 상세 페이지의 주요 정보를 표시하는 패널 컴포넌트입니다.
 * 노드의 기본 정보, 시스템 정보, 상태 정보를 포함하여 노드의 핵심 정보를
 * 한눈에 볼 수 있도록 구성되어 있습니다.
 *
 * @param data - 노드 상세 정보
 * @returns 노드의 주요 정보를 표시하는 패널 컴포넌트
 */
export function NodePrimaryPane({ data }: NodePrimaryPaneProps) {
  return (
    <DetailContentPane>
      {/* 노드 자원 상세정보 헤더 */}
      <DetailContentHeader>
        <DetailContentTitle>노드 자원 상세정보</DetailContentTitle>
      </DetailContentHeader>
      <DetailContentPaneBody>
        {/* 노드 기본 정보 섹션 */}
        <DetailContentFeature className="first">
          <DetailContentSubTitle>Node Information</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* 노드 기본 정보 (이름, IP, 호스트명) */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Node Name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeName || undefined}
                >
                  {data?.nodeName || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Internal IP</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeIp || undefined}
                >
                  {data?.nodeIp || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Host Name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.hostName || undefined}
                >
                  {data?.hostName || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 노드 역할 및 생성 시간 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Roles</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.role || undefined}
                >
                  {data?.role || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Creation Timestamp</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={formatDateSafely(data?.createdAt)}
                >
                  {formatDateSafely(data?.createdAt)}
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
                  title={data?.nodeSystemInfo?.machineID || undefined}
                >
                  {data?.nodeSystemInfo?.machineID || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>System UUID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.systemUUID || undefined}
                >
                  {data?.nodeSystemInfo?.systemUUID || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Boot ID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.bootID || undefined}
                >
                  {data?.nodeSystemInfo?.bootID || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kernel Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.kernelVersion || undefined}
                >
                  {data?.nodeSystemInfo?.kernelVersion || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>OS Image</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.osImage || undefined}
                >
                  {data?.nodeSystemInfo?.osImage || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 운영체제 및 런타임 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Operating System</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.operatingSystem || undefined}
                >
                  {data?.nodeSystemInfo?.operatingSystem || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Container Runtime Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={
                    data?.nodeSystemInfo?.containerRuntimeVersion || undefined
                  }
                >
                  {data?.nodeSystemInfo?.containerRuntimeVersion || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kubelet Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.kubeletVersion || undefined}
                >
                  {data?.nodeSystemInfo?.kubeletVersion || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Kube-Proxy Version</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.nodeSystemInfo?.kubeProxyVersion || undefined}
                >
                  {data?.nodeSystemInfo?.kubeProxyVersion || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow></DetailContentFeatureRow>
            </DetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
        {/* 노드 상태 정보 섹션 */}
        {data?.nodeCondition && data?.nodeCondition.length > 0 && (
          <DetailContentFeature className="last">
            <DetailContentSubTitle>Conditions</DetailContentSubTitle>
            <DetailContentFeatureGridBody>
              {data?.nodeCondition.map((condition) => (
                <NodeConditionCard
                  key={condition.conditionName}
                  {...condition}
                />
              ))}
            </DetailContentFeatureGridBody>
          </DetailContentFeature>
        )}
      </DetailContentPaneBody>
    </DetailContentPane>
  );
}
