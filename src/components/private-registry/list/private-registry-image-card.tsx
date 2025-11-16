"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/components/common/card/compact-card-layer.styled";
import type { PrivateRegistryImageListType } from "@/schemas/private-registry-image.schema";

interface PrivateRegistryImageCardProps extends PrivateRegistryImageListType {}

export function PrivateRegistryImageCard({
  id,
  projectId,
  name,
  description,
  pullCnt,
  updatedAt,
}: PrivateRegistryImageCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/private-registry/${projectId}/image/${id}`);
  };
  return (
    <Card
      contentVariant="compact"
      title={name}
      height={224}
      onClick={handleClick}
    >
      <Body>
        <Row>
          <Key>워크스페이스</Key>
          <Value>Workspace 1</Value>
        </Row>
        <Row>
          <Key>최신 태그</Key>
          <Value>v1.0.0</Value>
        </Row>
        <Row>
          <Key>최근 업로드 일시</Key>
          <Value>{updatedAt}</Value>
        </Row>
        <Row>
          <Key>이미지 전체 크기</Key>
          <Value>12GB</Value>
        </Row>
        <Row>
          <Key>다운로드 정보</Key>
          <Value>{pullCnt}</Value>
        </Row>
      </Body>
      <Footer>
        <Row>
          <Key>
            <DescriptionKey>
              <span>설</span>
              <span>명</span>
            </DescriptionKey>
          </Key>
          <DescriptionValue>{description}</DescriptionValue>
        </Row>
      </Footer>
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2px;
  width: 100%;
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

const DescriptionKey = styled.div`
  width: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DescriptionValue = styled(Value)`
  color: #707070;
`;
