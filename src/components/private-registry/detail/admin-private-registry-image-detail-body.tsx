"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { Button, Icon, Typography } from "xiilab-ui";

import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetAdminPrivateRegistryImage } from "@/hooks/private-registry-image/use-get-admin-private-registry-image";
import {
  ListPageBody,
  ListSectionTitle,
} from "@/styles/layers/list-page-layers.styled";
import { AdminPrivateRegistryImageTagListBody } from "./admin-private-registry-image-tag-list-body";
import { AdminPrivateRegistryImageTagListFilter } from "./admin-private-registry-image-tag-list-filter";

export function AdminPrivateRegistryImageDetailBody() {
  const { id, name } = useParams();
  const publish = usePublish();

  const registryName = name as string;
  const imageId = Number(id);

  const { data } = useGetAdminPrivateRegistryImage({
    registryName,
    imageId,
  });

  const handleDelete = () => {
    publish(PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteAdminRegistryImage, {
      registryName,
      imageId,
    });
  };

  return (
    <Container>
      <Header>
        <ListSectionTitle>컨테이너 이미지 기본 정보</ListSectionTitle>
        <Button
          width={80}
          size="small"
          variant="outlined"
          onClick={handleDelete}
        >
          이미지 삭제
        </Button>
      </Header>
      <Body>
        <Pane>
          <Record>
            <IconWrapper>
              <Icon name="Workspace02" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>컨테이너 :</Key>
            <Value>{data?.name || "-"}</Value>
          </Record>
          <Record>
            <IconWrapper>
              <Icon name="Workspace01" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>워크스페이스 :</Key>
            <Value>-</Value>
          </Record>
          <Record>
            <IconWrapper>
              <Icon name="Person" color="var(--icon-fill)" size={16} />
            </IconWrapper>
            <Key>생성자 :</Key>
            <Value>{data?.creatorName || "-"}</Value>
          </Record>
          <Record>
            <IconWrapper>
              <Icon name="Calendar" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>생성일 :</Key>
            <Value>
              {data?.creatorDate
                ? format(data?.creatorDate, "yyyy.MM.dd")
                : "-"}
            </Value>
          </Record>
        </Pane>
        <Pane>
          <Record>
            <IconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>설명 :</Key>
          </Record>
          <DescriptionRecord>
            <DescriptionValue>{data?.description}</DescriptionValue>
          </DescriptionRecord>
        </Pane>
      </Body>
      <AdminPrivateRegistryImageTagListFilter />
      <AdminPrivateRegistryImageTagListBody />
    </Container>
  );
}

const Container = styled(ListPageBody)``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Body = styled.div`
  border: 1px solid #e0e0e0;
  background-color: #f7f9fb;
  padding: 10px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 205px;
  margin-bottom: 36px;
`;

const Pane = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + & {
    border-left: 1px solid #e0e0e0;
    margin-left: 10px;
    padding-left: 10px;
  }
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 11px;

  & + & {
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
    margin-top: 10px;
  }
`;

const DescriptionRecord = styled(Record)`
  flex: 1;
  overflow-y: auto;
`;

const DescriptionValue = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #171b26;
  height: 100%;
`;

const IconWrapper = styled.div`
  border: 1px solid #d1d5dc;
  border-radius: 2px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;

  --icon-fill: #000;
`;

const Key = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const Value = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;
