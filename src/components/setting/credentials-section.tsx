"use client";

import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Button, Card, Icon, Typography } from "xiilab-ui";

import { openCreateCredentialModalAtom } from "@/atoms/common/modal.atom";
import { EmptyState } from "@/components/common/empty-state/empty-state";
import { CreateCredentialModal } from "@/components/common/modal/create-credential-modal";

/**
 * 크레덴셜 섹션 컴포넌트
 *
 * 사용자의 크레덴셜 목록을 관리하는 컴포넌트입니다.
 * - 크레덴셜 목록 카드
 * - 크레덴셜 추가/삭제
 * - 스크롤 가능한 목록
 */
export default function CredentialsSection() {
  // 크레덴셜 추가 모달 열기 함수
  const openCredentialAddModal = useSetAtom(openCreateCredentialModalAtom);

  // 임시 데이터 - 빈 상태로 설정
  const credentials: any[] = [];

  return (
    <Container>
      <Header>
        <Title>크레덴셜 목록</Title>
        <CredentialCount>총 {credentials.length}건</CredentialCount>
        <Button
          color="primary"
          variant="gradient"
          width={120}
          height={30}
          icon="Plus"
          iconSize={18}
          iconPosition="left"
          style={{ marginLeft: "auto", fontSize: "13px", fontWeight: 500 }}
          onClick={() => openCredentialAddModal(true)}
        >
          {credentials.length === 0 ? "크레덴셜 생성" : "크레덴셜 추가"}
        </Button>
      </Header>

      <ContentContainer>
        {credentials.length === 0 ? (
          <EmptyState
            icon={<Icon name="CredentialFilled" color="#878898" size={32} />}
            title="생성된 크레덴셜이 없습니다."
            content="크레덴셜 생성 버튼을 클릭하여 크레덴셜을 생성해 주세요."
          />
        ) : (
          <ListContainer>
            {credentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                contentVariant="default"
                height={150}
                showHeader={false}
                onClick={() =>
                  console.log(`Clicked credential ${credential.id}`)
                }
              >
                <CardContent>
                  <CardTop>
                    <TypeBadge type={credential.type}>
                      {credential.type}
                    </TypeBadge>
                    <DeleteButton>🗑️</DeleteButton>
                  </CardTop>

                  <CredentialName>{credential.name}</CredentialName>
                  <Description>{credential.description}</Description>

                  <CardFooter>
                    <Creator>
                      <CreatorIcon>👤</CreatorIcon>
                      {credential.creator}
                    </Creator>
                    <CreatedDate>
                      <DateIcon>📅</DateIcon>
                      {credential.createdDate}
                    </CreatedDate>
                  </CardFooter>
                </CardContent>
              </CredentialCard>
            ))}
          </ListContainer>
        )}
      </ContentContainer>

      {/* 크레덴셜 추가 모달 */}
      <CreateCredentialModal />
    </Container>
  );
}

const CredentialCard = styled(Card)`
  border: 1px solid #d1d5dc !important;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #1f5bff !important;
  }
`;

const Container = styled.div`
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px variant
  as: "h2",
})`
  color: #000000;
  margin: 0;
  margin-right: 6px;
`;

const CredentialCount = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  color: #000000;
`;

const ListContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  overflow-y: auto;
  padding-right: 8px;
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CredentialName = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px, or use custom for 14px
  as: "h3",
})`
  color: #171b26;
  margin: 0 0 10px 0;
`;

const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #9da6bc;
`;

const TypeBadge = styled(Typography.Text).attrs({
  variant: "body-3-2", // 11px, 500 weight
})<{ type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 2px;
  margin-bottom: 8px;
  width: fit-content;

  ${({ type }) =>
    type === "Git"
      ? `
    background: #fafafa;
    border: 1px solid #FFC09F;
    color: #633200;
  `
      : `
    background: #fafafa;
    border: 1px solid #D0B9FF;
    color: #1E0094;
  `}
`;

const Description = styled(Typography.Text).attrs({
  variant: "body-3-3", // 11px, 400 weight
  as: "p",
})`
  color: #171b26;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Creator = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #171b26;
`;

const CreatorIcon = styled.span`
  font-size: 14px;
`;

const CreatedDate = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #171b26;
`;

const DateIcon = styled.span`
  font-size: 14px;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
