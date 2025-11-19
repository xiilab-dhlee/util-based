"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { JupyterIcon } from "@/components/common/icon/jupyter-icon";
import { PytorchIcon } from "@/components/common/icon/pytorch-icon";
import { useGetWorkloadByMode } from "@/hooks/workload/use-get-workload-by-mode";
import {
  DetailContentArticle,
  DetailContentSubTitle,
} from "@/styles/layers/detail-page-layers.styled";
import { getWorkloadJobTypeInfo } from "@/utils/workload/workload.util";

/**
 * 워크로드 기본 정보 아티클 컴포넌트
 *
 * 워크로드 잡 타입, 노드 타입, IDE 정보를 표시합니다.
 */
export function WorkloadPrimaryArticle() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  // hooks는 항상 최상위에서 호출
  const { data } = useGetWorkloadByMode({
    workspaceId: String(searchParams?.get("workspaceId")),
    workloadId: String(id),
  });

  const { label, ideName, ideIcon, nodeType, nodeIcon } =
    getWorkloadJobTypeInfo(data?.jobType);

  return (
    <DetailContentArticle>
      {/* <Column>
        <DetailContentSubTitle>워크스페이스 적용</DetailContentSubTitle>
        <ColumnBody>
          <IconWraper>
            <Icon name="Workspace01" color="var(--icon-fill)" size={18} />
          </IconWraper>
          <span>{workspaceName}</span>
        </ColumnBody>
      </Column> */}
      <Column>
        <DetailContentSubTitle>Job Type</DetailContentSubTitle>
        <ColumnBody>
          <IconWraper className="jobtype">
            {ideIcon === "pytorch" ? (
              <PytorchIcon />
            ) : ideIcon === "jupyter" ? (
              <JupyterIcon />
            ) : null}
          </IconWraper>
          <JobTypeText>{label}</JobTypeText>
          <Description>{ideName}</Description>
        </ColumnBody>
      </Column>
      <Column>
        <DetailContentSubTitle>노드 타입</DetailContentSubTitle>
        <ColumnBody>
          <IconWraper>
            <Icon name={nodeIcon} color="var(--icon-fill)" size={18} />
          </IconWraper>
          <NodeTypeText>{nodeType} Node</NodeTypeText>
        </ColumnBody>
      </Column>
    </DetailContentArticle>
  );
}

const Column = styled.div`
  flex: 1;
  padding: 0px 17px;
`;

const ColumnBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 14px;
  text-transform: capitalize;
  color: #22212a;
`;

const JobTypeText = styled.span`
  text-transform: capitalize;
  margin-left: 8px;
`;

const NodeTypeText = styled.span`
  text-transform: capitalize;
`;

const IconWraper = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  --icon-fill: #000;

  &.jobtype::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 24px;
    height: 24px;
    border: 1px solid #d5d4d8;
    border-radius: 50%;
  }
`;
