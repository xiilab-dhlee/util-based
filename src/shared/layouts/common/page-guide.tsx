"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { CoreGuide } from "@/shared/types/core.model";
import { gradientBackgroundButtonStyle } from "@/styles/mixins/button";
import { PageGuideItem } from "./page-guide-item";

/**
 * 페이지 가이드 컴포넌트의 props 인터페이스
 */
interface PageGuideProps {
  /** 제목 영문 */
  titleEng: string;
  /** 제목 */
  title: string;
  /** 아이콘 */
  icon: string;
  /** 설명 (문자열 배열) */
  description: string[];
  /** 이미지 이름 */
  backgroundImageName: string;
  /** 가이드 항목들 */
  guides: CoreGuide[];
  /** 버튼 옵션 */
  buttonOptions?: {
    enabled: boolean;
    text: string;
    onClick: () => void;
  };
}

/**
 * 페이지 가이드 컴포넌트
 */
export function PageGuide({
  titleEng,
  title,
  icon,
  description,
  backgroundImageName,
  guides,
  buttonOptions,
}: PageGuideProps) {
  return (
    <Container>
      <Header $imageName={backgroundImageName}>
        <HeaderContent>
          <TitleEng>{titleEng}</TitleEng>
          <Title>
            <TitleIconWrapper>
              <Icon name={icon} color="var(--icon-fill)" />
            </TitleIconWrapper>
            <span>{title}</span>
          </Title>
          <Description>
            {description.map((line, idx) => (
              <span key={line}>
                {line}
                {idx < description.length - 1 && <br />}
              </span>
            ))}
          </Description>
          {buttonOptions?.enabled && (
            <ActionButton onClick={buttonOptions.onClick}>
              {buttonOptions.text}
            </ActionButton>
          )}
        </HeaderContent>
      </Header>
      <Body>
        {guides.map((guide) => (
          <PageGuideItem key={guide.title} {...guide} />
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 490px;
  border-radius: 10px;
  background-color: #070913;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  padding: 24px;
`;

const Header = styled.div<{ $imageName: string }>`
  height: 250px;
  background-image: url("/images/${({ $imageName }) => $imageName}");
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TitleEng = styled.div`
  color: #d1d1d1;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 24px;
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  font-size: 18px;
  color: #f5f5f5;
  position: relative;
  margin-bottom: 12px;
`;

const TitleIconWrapper = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #434857;
  background-color: #070913;
  border-radius: 2px;

  --icon-fill: #fafafa;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #e0e0e0;
`;

const ActionButton = styled.button`
  ${gradientBackgroundButtonStyle}

  position: absolute;
  bottom: 0;
  left: 0;
`;

const Body = styled.div`
  width: 100%;
  height: 178px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #171b26;
  padding: 20px;
`;
