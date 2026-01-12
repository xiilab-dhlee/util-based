"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";
import { formatFileSize } from "@/shared/utils/file.util";

type PrivateRegistryImageCardProps = ImageTagListResponse;

export function PrivateRegistryImageCard({
  imageTagName,
  imageTagSizeByte,
  scanStatus,
  vulnerability,
  uploadedAt,
}: PrivateRegistryImageCardProps) {
  return (
    <Card contentVariant="compact" title={imageTagName} height={224}>
      <Body>
        <Row>
          <Key>태그 크기</Key>
          <Value>{formatFileSize(imageTagSizeByte).formatted}</Value>
        </Row>
        <Row>
          <Key>스캔 상태</Key>
          <Value>{scanStatus}</Value>
        </Row>
        <Row>
          <Key>업로드일시</Key>
          <Value>{uploadedAt ?? "-"}</Value>
        </Row>
        <Row>
          <Key>취약점</Key>
          <Value>
            {vulnerability
              ? `C:${vulnerability.criticalCount} H:${vulnerability.highCount} M:${vulnerability.mediumCount} L:${vulnerability.lowCount}`
              : "-"}
          </Value>
        </Row>
      </Body>
    </Card>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e9ebee;
  padding-bottom: 13px;
  margin-bottom: 13px;
  width: 100%;
  gap: 8px;
`;

const Row = styled(CompactCardKeyValueRow)`
  height: 14px;
`;

const Key = styled(CompactCardKey)`
  width: 88px;
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

const Value = styled(CompactCardValue)`
  line-height: 14px;
`;
