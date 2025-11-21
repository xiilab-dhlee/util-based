"use client";

import { format } from "date-fns";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import { getWorkloadStatusInfo } from "@/domain/workload/utils/workload.util";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";

interface SearchWorkloadCardProps extends WorkloadListType {
  isChecked: boolean;
  onCheck: () => void;
}

export function SearchWorkloadCard({
  workloadName,
  creatorDate,
  jobType,
  status,
  isChecked,
  onCheck,
}: SearchWorkloadCardProps) {
  const { label } = getWorkloadStatusInfo(status);
  return (
    <Card
      contentVariant="compact"
      title={workloadName}
      height={138}
      showCheckBox
      checked={isChecked}
      onCheckboxChange={onCheck}
    >
      <Body>
        <CompactCardKeyValueRow>
          <Key>상&nbsp;&nbsp;&nbsp;태</Key>
          <CompactCardValue>{label}</CompactCardValue>
        </CompactCardKeyValueRow>
        <CompactCardKeyValueRow>
          <Key>생성일</Key>
          <CompactCardValue>
            {format(creatorDate, "yyyy.MM.dd")}
          </CompactCardValue>
        </CompactCardKeyValueRow>
      </Body>
      <Footer>
        <CompactCardKeyValueRow>
          <Key>타&nbsp;&nbsp;&nbsp;입</Key>
          <JobTypeValue>{jobType.toLowerCase()}</JobTypeValue>
        </CompactCardKeyValueRow>
      </Footer>
    </Card>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e9ebee;
  padding-bottom: 6px;
  margin-bottom: 4px;
  gap: 4px;
  width: 100%;
`;

const Key = styled(CompactCardKey)`
  width: 37px;
  position: relative;
  line-height: 14px;

  &::after {
    position: absolute;
    content: ":";
    line-height: 12px;
    top: 0;
    right: 0;
  }
`;

const JobTypeValue = styled(CompactCardValue)`
  text-transform: capitalize;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2px;
  width: 100%;
`;
