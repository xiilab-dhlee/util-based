"use client";

import styled from "styled-components";
import { Button, Card } from "xiilab-ui";

import type { ImageJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { RegistryLogButton } from "@/domain/registry/components/list/registry-job-log-button";
import { RegistryJobRestartButton } from "@/domain/registry/components/list/registry-job-restart-button";
import { RegistryJobStopButton } from "@/domain/registry/components/list/registry-job-stop-button";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";
import { MyDropdown } from "@/shared/components/dropdown";
import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

type RegistryImageCardProps = ImageJobResponse;

export function RegistryImageCard({
  imageTagId,
  imageName,
  imageTagName,
  creatorName,
  status,
  createdAt,
}: RegistryImageCardProps) {
  const title = `${imageName || "-"}:${imageTagName || "-"}`;

  return (
    <CardWrapper data-testid={REGISTRY_SELECTOR.JOB_LIST_CARD}>
      <Card
        contentVariant="compact"
        title={title}
        height="100%"
        actionElement={
          <MyDropdown
            placement="bottomRight"
            items={[
              <RegistryJobRestartButton
                key="restart"
                imageTagId={imageTagId}
              />,
              <RegistryJobStopButton key="stop" imageTagId={imageTagId} />,
              <RegistryLogButton key="log" />,
            ]}
          >
            <Button
              width="100%"
              variant="outlined"
              icon="MoreHorizonal"
              data-testid={REGISTRY_SELECTOR.JOB_LIST_CARD_DROPDOWN_TRIGGER}
            />
          </MyDropdown>
        }
      >
        <Body>
          <Pane>
            <Row>
              <Key>생성일시</Key>
              <Value data-testid={REGISTRY_SELECTOR.JOB_LIST_CREATED_AT}>
                {formatDateTimeSafely(createdAt)}
              </Value>
            </Row>
            <Row>
              <Key>생성자</Key>
              <Value>{creatorName || "-"}</Value>
            </Row>
          </Pane>
          <Pane>
            <Row>
              <Key>상태</Key>
              <Value data-testid={REGISTRY_SELECTOR.JOB_LIST_STATUS}>
                {status}
              </Value>
            </Row>
          </Pane>
        </Body>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const Pane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & + & {
    border-left: 1px solid #E1E4E7;
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
