"use client";

// import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, Card } from "xiilab-ui";

import type { PullPushJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PrivateRegistryLogButton } from "@/domain/private-registry/components/list/private-registry-log-button";
import { PRIVATE_REGISTRY_JOB_CARD_HEIGHT } from "@/domain/private-registry/constants/private-registry.constant";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";
import { MyDropdown } from "@/shared/components/dropdown";
import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
// import { ROUTES } from "@/shared/constants/routes.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

type PrivateRegistryImageCardProps = PullPushJobResponse;

export function PrivateRegistryImageCard({
  // imageId,
  imageName,
  imageTagName,
  status,
  createdAt,
}: PrivateRegistryImageCardProps) {
  // const router = useRouter();
  const title = `${imageName || "-"}:${imageTagName || "-"}`;

  // const handleClick = () => {
  //   router.push(ROUTES.USER_PRIVATE_REGISTRY_DETAIL(imageId));
  // };

  return (
    <CardWrapper data-testid={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_CARD}>
      <Card
        contentVariant="compact"
        title={title}
        height={PRIVATE_REGISTRY_JOB_CARD_HEIGHT}
        // onClick={handleClick}
        actionElement={
          <MyDropdown
            placement="bottomRight"
            items={[<PrivateRegistryLogButton key="log" />]}
          >
            <Button width="100%" variant="outlined" icon="MoreHorizonal" />
          </MyDropdown>
        }
      >
        <Body>
          <Pane>
            <Row>
              <Key>구분</Key>
              <Value
                data-testid={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_IMAGE_TYPE}
              >
                Snapshot
              </Value>
            </Row>
            <Row>
              <Key>상태</Key>
              <Value data-testid={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_STATUS}>
                {status}
              </Value>
            </Row>
          </Pane>
          <Pane>
            <Row>
              <Key>생성일시</Key>
              <Value
                data-testid={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_CREATED_AT}
              >
                {formatDateTimeSafely(createdAt)}
              </Value>
            </Row>
          </Pane>
        </Body>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div``;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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
`;
