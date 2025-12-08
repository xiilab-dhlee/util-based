"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { Button, Icon, Typography } from "xiilab-ui";

interface DataErrorStateProps {
  /** 에러 제목 (기본: "데이터를 불러 올 수 없습니다.") */
  title?: string;
  /** 상세 에러 메시지 (옵션) */
  description?: string;
  /** 다시 시도 버튼 클릭 시 호출되는 콜백 */
  onRetry?: () => void;
  /** 다시 시도 버튼 라벨 (기본: "다시 시도") */
  retryLabel?: string;
  /** 외부에서 추가 스타일을 주입할 때 사용하는 className */
  className?: string;
  /** 기본 아이콘 대신 사용할 수 있는 커스텀 아이콘 */
  icon?: ReactNode;
}

/**
 * 데이터 로딩 실패 시 공통으로 사용하는 에러 상태 컴포넌트
 *
 * - 부모 컨테이너 안에서 가운데 정렬되는 가벼운 블록 컴포넌트
 * - 기본 에러 메시지 + 상세 설명 + "다시 시도" 버튼
 */
export function DataErrorState({
  title = "데이터를 불러 올 수 없습니다.",
  description,
  onRetry,
  retryLabel = "다시 시도",
  className,
  icon,
}: DataErrorStateProps) {
  return (
    <Wrapper className={className}>
      <Body>
        <IconCircle>
          {icon ?? <Icon name="PriorityHigh" color="#878898" />}
        </IconCircle>
        <Message>
          <Title variant="body-1-1" as="h3">
            {title}
          </Title>
          {description ? (
            <Description variant="body-2-4" as="p">
              {description}
            </Description>
          ) : null}
        </Message>
        {onRetry ? (
          <Button
            icon="Refresh"
            variant="outlined"
            size="small"
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        ) : null}
      </Body>
    </Wrapper>
  );
}

/** 부모 컨테이너 안에서 가운데 정렬을 담당하는 래퍼 */
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
`;

/** 아이콘, 메시지, 버튼을 세로로 정렬하는 본문 컨테이너 */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 360px;
  width: 100%;
`;

/** 원형 배경에 에러 아이콘을 표시하는 래퍼 */
const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(135, 136, 152, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** 제목과 설명 텍스트를 감싸는 영역 */
const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled(Typography.Text)`
  font-weight: 600;
  color: #333333;
`;

const Description = styled(Typography.Text)`
  color: #666666;
  line-height: 1.5;
`;
