"use client";

import { format } from "date-fns";
import styled from "styled-components";
import { Card, Icon, Tag, type TagProps } from "xiilab-ui";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";

interface SettingCredentialCardProps extends CredentialListType {}

export function SettingCredentialCard({
  name,
  description,
  type,
  creatorName,
  creatorDate,
}: SettingCredentialCardProps) {
  let variant: TagProps["variant"];
  if (type === "GIT") {
    variant = "yellow";
  } else if (type === "DOCKER") {
    variant = "purple";
  }

  const handleDelete = () => {
    alert("준비 중입니다.");
  };
  return (
    <StyledCard contentVariant="default" height={100} showHeader={false}>
      <Container>
        <IconWrapper onClick={handleDelete}>
          <Icon name="Delete" size={20} color="#9DA6BC" />
        </IconWrapper>
        <Header>
          <Title>
            <StyledTag variant={variant}>{type.toLowerCase()}</StyledTag>
            <CredentialName>{name}</CredentialName>
          </Title>
          <Description>{description}</Description>
        </Header>
        <Footer>
          <FooterItem>
            <Icon name="Person" size={16} color="#404040" />
            <span>{creatorName}</span>
          </FooterItem>
          <FooterItem>
            <Icon name="Calendar" size={16} color="#404040" />
            <span>{format(creatorDate, "yyyy.MM.dd")}</span>
          </FooterItem>
        </Footer>
      </Container>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  
`;

const StyledTag = styled(Tag)`
  height: 20px;
  text-transform: capitalize;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 0 16px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  border-bottom: 1px solid #d1d5dc;
  margin-bottom: 3px;
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
`;

const CredentialName = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #171B26;
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 100%;
  color: #171B26;
  
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 26px;
`;

const FooterItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #171B26;
  gap: 4px;

  & + & {
    border-left: 1px solid #A0A5AC;
    margin-left: 10px;
    padding-left: 5px;
  }
`;

const IconWrapper = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
