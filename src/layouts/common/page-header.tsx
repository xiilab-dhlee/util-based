"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { getBackPathname } from "@/utils/common/router.util";

type PageHeaderProps = {
  // 페이지 타이틀
  title: string;
  // 페이지 타이틀 아이콘 타입
  icon: string;
  // 페이지 설명
  description: string;
  // 기존 구조와 다른 라우팅 필요 시 정의
  customPathname?: string;
};
// 페이지 헤더 영역
export function PageHeader({
  title,
  icon,
  description,
  children,
  customPathname,
}: PropsWithChildren<PageHeaderProps>) {
  const pathname = usePathname();
  const router = useRouter();
  // 뒤로가기 버튼 클릭 시 목록 페이지로 이동
  const handleBack = () => {
    if (customPathname) {
      router.replace(customPathname);
    } else {
      router.replace(getBackPathname(pathname));
    }
  };
  return (
    <Container>
      <Left>
        {/* 페이지 depth가 2이상인 경우 */}
        {icon === "Back" ? (
          <BackIconWrapper onClick={handleBack}>
            <Icon name="Back" color="var(--icon-fill)" size={24} />
            <span className="sr-only">뒤로가기</span>
          </BackIconWrapper>
        ) : (
          <IconWrapper>
            <Icon name={icon} color="var(--icon-fill)" size={16} />;
          </IconWrapper>
        )}

        {/* 주로 목록 페이지인 경우 */}

        {/* after: xiilab-ui Typography 사용, headline01 */}
        <Title>{title}</Title>
        {/* after: xiilab-ui Typography 사용, Body01 */}
        <Description>{description}</Description>
      </Left>
      {children && <Right>{children}</Right>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  flex-shrink: 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #000;
  margin-right: 6px;
  overflow: hidden;

  --icon-fill: #fff;

  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }
`;

const BackIconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  // transform: rotate(90deg);
  margin-right: 6px;
  border: none;
  background-color: transparent;

  --icon-fill: #000;
`;

const Title = styled.h1`
  font-weight: 700;
  line-height: 1.5;
  margin-right: 6px;
  letter-spacing: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

const Description = styled.div`
  padding-left: 6px;
  font-weight: 400;
  line-height: 1.5;
  color: #6f707c;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 14px;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 50%;
    content: "";
    width: 1px;
    background-color: #ced3d8;
  }
`;
