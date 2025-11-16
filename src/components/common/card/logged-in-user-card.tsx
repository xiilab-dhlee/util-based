"use client";

import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";

interface LoggedInUserCardProps {
  username: string;
  email: string;
}

/**
 * 로그인한 사용자 정보 카드 컴포넌트
 *
 * 현재 로그인한 사용자의 이름과 이메일을 표시하는 카드입니다.
 * 사용자 아바타와 함께 사용자 정보를 시각적으로 표현합니다.
 */
export function LoggedInUserCard({ username, email }: LoggedInUserCardProps) {
  return (
    <Container>
      <Avatar>
        <MyIcon name="astrago" />
      </Avatar>
      <Body>
        <Name>{username}</Name>
        <Email>{email}</Email>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  border-radius: 2px;
  border: 1px solid #ced2d6;
  background: #fff;
  height: 56px;
  display: flex;
  padding: 12px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid #bfb9fb;
  background-color: #f6f7ff;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: #5b29c7;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;

const Email = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #4a4a4a;
`;
