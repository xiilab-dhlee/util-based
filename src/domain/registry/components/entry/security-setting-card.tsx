import type { ReactNode } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

interface SecuritySettingCardProps {
  /** 카드 제목 (여러 줄 지원을 위해 ReactNode 타입) */
  title: ReactNode;
  /** 카드 설명 텍스트 */
  description: string;
  /** 카드 우측 상단에 표시될 액션 요소 (Switch, Label 등) */
  action?: ReactNode;
}

/**
 * 레지스트리 보안 정책 설정 카드 컴포넌트
 *
 * 보안 설정 항목을 표시하는 재사용 가능한 카드입니다.
 * 제목, 설명, 그리고 선택적으로 토글 스위치나 라벨 등의 액션을 포함합니다.
 */
export function SecuritySettingCard({
  title,
  description,
  action,
}: SecuritySettingCardProps) {
  return (
    <Container>
      <Header>
        <Typography.Text variant="subtitle-2-2" color="#fff">
          {title}
        </Typography.Text>
        {action}
      </Header>
      <Body>
        <Typography.Text variant="body-1-1" color="#BDBDBD">
          {description}
        </Typography.Text>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  background-color: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const Header = styled.div`
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  padding: 12px 10px;
  background-color: #171b26;
  border: 1px solid #2a3041;
  border-radius: 4px;
`;
