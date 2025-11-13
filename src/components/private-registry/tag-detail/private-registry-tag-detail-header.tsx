"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

interface TagDetailHeaderProps {
  /** Tag version string to display */
  version?: string;
}

export function PrivateRegistryTagDetailHeader({
  version = "v.0.0",
}: TagDetailHeaderProps) {
  const router = useRouter();

  return (
    <Container>
      <BreadcrumbSection>
        <BreadcrumbItem>
          <Icon name="Dashboard" size={14} />
          대시보드
        </BreadcrumbItem>
        <BreadcrumbArrow>
          <Icon name="ArrowRight" size={12} />
        </BreadcrumbArrow>
        <BreadcrumbItem>내부 레지스트리</BreadcrumbItem>
        <BreadcrumbArrow>
          <Icon name="ArrowRight" size={12} />
        </BreadcrumbArrow>
        <BreadcrumbItem>컨테이너 이미지 상세정보</BreadcrumbItem>
        <BreadcrumbArrow>
          <Icon name="ArrowRight" size={12} />
        </BreadcrumbArrow>
        <BreadcrumbItem $active>태그 상세정보</BreadcrumbItem>
      </BreadcrumbSection>

      <TitleSection>
        <BackButton onClick={() => router.back()}>
          <Icon name="ArrowLeft" size={16} />
        </BackButton>
        <TitleGroup>
          <Title>태그 상세정보</Title>
          <SubTitle>Tag Information</SubTitle>
        </TitleGroup>
        <Divider />
        <TagVersion>{version}</TagVersion>
      </TitleSection>
    </Container>
  );
}


const Container = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e9ebee;
  padding: 24px;
`;

const BreadcrumbSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const BreadcrumbItem = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})<{ $active?: boolean }>`
  line-height: 16px;
  color: ${({ $active }) => ($active ? "#000000" : "#6F707C")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BreadcrumbArrow = styled.div`
  display: flex;
  align-items: center;
  color: #b2b2b2;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #ced3d8;
  background: #ffffff;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  svg {
    color: #6f707c;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px is closest to 18px
  as: "h1",
})`
  line-height: 20px;
  color: #000000;
  margin: 0;
  font-weight: 700; // Keep 700 weight
  font-size: 18px; // Keep custom 18px
`;

const SubTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "span",
})`
  line-height: 16px;
  color: #6f707c;
  font-size: 14px; // Keep custom 14px
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background: #ced3d8;
`;

const TagVersion = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "span",
})`
  line-height: 16px;
  color: #f5f5f5;
  font-weight: 700; // Keep 700 weight
  font-size: 14px; // Keep custom 14px
`;
