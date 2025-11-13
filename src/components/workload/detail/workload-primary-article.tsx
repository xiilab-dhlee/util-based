"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";

import { MyIcon } from "@/components/common/icons";
import { Workload } from "@/models/workload.model";
import type { WorkloadDetailType } from "@/schemas/workload.schema";
import {
  DetailContentArticle,
  DetailContentSubTitle,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 상세 페이지 기본 정보 아티클의 props 인터페이스
 */
interface WorkloadPrimaryArticleProps extends WorkloadDetailType {}

/**
 * 워크로드 상세 페이지 기본 정보 아티클 컴포넌트
 */
export function WorkloadPrimaryArticle({
  // workspaceName,
  jobType,
}: PropsWithChildren<WorkloadPrimaryArticleProps>) {
  const { displayName, ideName, ideIconName, nodeType, nodeIconName } =
    Workload.getJobTypeInfo(jobType);

  return (
    <DetailContentArticle>
      {/* <Column>
        <DetailContentSubTitle>워크스페이스 적용</DetailContentSubTitle>
        <ColumnBody>
          <IconWraper>
            <MyIcon name="Workspace01" color="var(--icon-fill)" size={18} />
          </IconWraper>
          <span>{workspaceName}</span>
        </ColumnBody>
      </Column> */}
      <Column>
        <DetailContentSubTitle>Job Type</DetailContentSubTitle>
        <ColumnBody>
          <IconWraper className="jobtype">
            <MyIcon name={ideIconName} />
          </IconWraper>
          <JobTypeText>{displayName}</JobTypeText>
          <Description>{ideName}</Description>
        </ColumnBody>
      </Column>
      <Column>
        <DetailContentSubTitle>노드 타입</DetailContentSubTitle>
        <ColumnBody>
          <IconWraper>
            <MyIcon name={nodeIconName} color="var(--icon-fill)" size={18} />
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
