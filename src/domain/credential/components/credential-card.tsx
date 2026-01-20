"use client";

import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Card, Icon, Tag } from "xiilab-ui";

import type { CredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getCredentialTypeInfo } from "@/domain/credential/constants/credential.constant";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { CREDENTIAL_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { checkIsSuperAdmin } from "@/shared/utils/auth.util";
import { formatDateSafely } from "@/shared/utils/date.util";

type CredentialCardProps = CredentialListItemResponse;

export function CredentialCard({
  credentialId,
  credentialName,
  description,
  credentialType,
  creatorName,
  creatorId,
  createDateTime,
}: CredentialCardProps) {
  const { data: session } = useSession();
  const publish = usePublish();

  const isOwner = session?.user?.id === creatorId;
  const isSuperAdmin = checkIsSuperAdmin(session);
  const canDelete = isOwner || isSuperAdmin;

  const { label, variant } = getCredentialTypeInfo(credentialType);

  const handleCardClick = () => {
    publish(CREDENTIAL_EVENTS.openDetailModal, {
      accountId: creatorId,
      credentialId,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    publish(CREDENTIAL_EVENTS.openDeleteModal, {
      accountId: creatorId,
      credentialId,
    });
  };

  return (
    <StyledCard
      contentVariant="default"
      showHeader={false}
      onClick={handleCardClick}
    >
      <Container>
        <Header>
          <Title>
            <StyledTag variant={variant}>{label}</StyledTag>
            <CredentialName
              className="truncate"
              data-testid={CREDENTIAL_SELECTOR.CARD_NAME}
            >
              {credentialName || "-"}
            </CredentialName>
            {canDelete && (
              <DeleteButton className="icon-button" onClick={handleDelete}>
                <Icon name="Delete" size={20} color="#9DA6BC" />
                <span className="sr-only">크리덴셜 삭제</span>
              </DeleteButton>
            )}
          </Title>
          <Description>{description || "-"}</Description>
        </Header>
        <Footer>
          <FooterItem>
            <Icon name="Person" size={16} color="#404040" />
            <span>{creatorName || "-"}</span>
          </FooterItem>
          <FooterItem>
            <Icon name="Calendar01" size={16} color="#404040" />
            <span>{formatDateSafely(createDateTime)}</span>
          </FooterItem>
        </Footer>
      </Container>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  
`;

const StyledTag = styled(Tag)`
  text-transform: capitalize;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 12px 16px;
  position: relative;
  cursor: pointer;
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

const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
`;
