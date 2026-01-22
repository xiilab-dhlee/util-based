"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { AccountImageTagResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";
import { ROUTES } from "@/shared/constants/routes.constant";
import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

type RegistryTagCardProps = AccountImageTagResponse;

export function RegistryTagCard({
  harborImageName,
  imageDisplayName,
  tagName,
  sizeByte,
  uploadedAt,
  workspaceName,
  description,
}: RegistryTagCardProps) {
  const router = useRouter();
  const title = [imageDisplayName, tagName].filter(Boolean).join(":") || "-";

  const handleClick = () => {
    const encodedHarborImageName = encodeURIComponent(harborImageName);
    router.push(
      ROUTES.ADMIN_PRIVATE_REGISTRY_DETAIL(encodedHarborImageName, tagName),
    );
  };

  return (
    <CardWrapper data-testid={REGISTRY_SELECTOR.TAG_LIST_CARD}>
      <Card
        contentVariant="compact"
        title={title}
        height="100%"
        onClick={handleClick}
      >
        <Content>
          <Body>
            <Pane>
              <Row>
                <Key>워크스페이스</Key>
                <Value>{workspaceName || "-"}</Value>
              </Row>
              <Row>
                <Key>이미지 전체 크기</Key>
                <Value>{formatFileSize(sizeByte ?? 0).formatted}</Value>
              </Row>
            </Pane>
            <Pane>
              <Row>
                <Key>최근 업로드 일시</Key>
                <Value data-testid={REGISTRY_SELECTOR.TAG_LIST_UPLOADED_AT}>
                  {formatDateTimeSafely(uploadedAt)}
                </Value>
              </Row>
            </Pane>
          </Body>
          <Footer>
            <Row>
              <DescriptionKey>설 명</DescriptionKey>
              <Description>{description || "-"}</Description>
            </Row>
          </Footer>
        </Content>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Footer = styled.div`
  border-top: 1px solid #e1e4e7;
  padding-top: 8px;
`;

const Pane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & + & {
    border-left: 1px solid #e1e4e7;
    padding-left: 12px;
  }
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
  text-indent: 16px;
  text-transform: capitalize;
`;

const DescriptionKey = styled(Key)`
  word-spacing: 15px;
`;

const Description = styled(Value)`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
