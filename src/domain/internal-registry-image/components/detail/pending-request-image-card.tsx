"use client";

import { format } from "date-fns";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { RequestImageListType } from "@/domain/request-image/schemas/request-image.schema";
import { CompactCardCollapseRow } from "@/shared/components/card/compact-card-collapse-row";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";

interface PendingRequestImageCardProps extends RequestImageListType {}

export function PendingRequestImageCard({
  imageName,
  requestReason,
  creatorName,
  creatorDate,
}: PendingRequestImageCardProps) {
  return (
    <StyledCard contentVariant="compact" title={imageName}>
      <Body>
        <CompactCardKeyValueRow>
          <Key>요 청 자</Key>
          <CompactCardValue>{creatorName}</CompactCardValue>
        </CompactCardKeyValueRow>
        <CompactCardKeyValueRow>
          <Key>요청일시</Key>
          <CompactCardValue>
            {format(creatorDate, "yyyy.MM.dd HH:mm:ss")}
          </CompactCardValue>
        </CompactCardKeyValueRow>
      </Body>
      <Footer>
        <CompactCardCollapseRow title="요청사유" description={requestReason} />
      </Footer>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`  
  & + & {
    margin-top: 8px;

  }
`;
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
  width: 48px;
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2px;
  width: 100%;
`;
