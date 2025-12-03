"use client";

import styled from "styled-components";
import type { TypographyVariant } from "xiilab-ui";
import { Button, Label, Typography } from "xiilab-ui";

import {
  SECURITY_USAGE_DISABLED,
  SECURITY_USAGE_ENABLED,
  SECURITY_USAGE_OPTIONS,
  type SecurityUsageStatus,
} from "@/shared/constants/security.constant";

interface SecurityLevelPolicySettingProps {
  title: string;
  descriptions: {
    variant: TypographyVariant;
    content: string;
  }[];
  onClickSetting: () => void;
  usageStatus?: SecurityUsageStatus;
}

function getUsageStatusVariant(usageStatus?: SecurityUsageStatus) {
  if (usageStatus === SECURITY_USAGE_ENABLED) {
    return "blue";
  }

  if (usageStatus === SECURITY_USAGE_DISABLED) {
    return "black";
  }

  // 그 외 상태는 기본값
  return undefined;
}

/**
 * 보안 레벨 설정 전용 정책 카드
 * 우측에 "설정" 버튼(아이콘: SystemFilled)이 노출되고, 클릭 시 모달을 여는 역할만 담당합니다.
 */
export function SecurityLevelPolicySetting({
  title,
  descriptions,
  onClickSetting,
  usageStatus,
}: SecurityLevelPolicySettingProps) {
  const usageLabel = usageStatus
    ? SECURITY_USAGE_OPTIONS.find((option) => option.key === usageStatus)?.label
    : undefined;

  return (
    <Container>
      <Header>
        <Typography.Text variant="body-1-1">{title}</Typography.Text>
        <HeaderActions>
          {usageLabel ? (
            <UsageStatusLabel variant={getUsageStatusVariant(usageStatus)}>
              {usageLabel}
            </UsageStatusLabel>
          ) : null}
          <Button
            size="small"
            icon="SystemFilled"
            iconSize={16}
            onClick={onClickSetting}
          />
        </HeaderActions>
      </Header>
      <Body>
        {descriptions.map(({ variant, content }) => (
          <Typography.Text variant={variant} color="#484848" key={content}>
            {content}
          </Typography.Text>
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 14px;

  & + & {
    border-left: 1px solid #e0e0e0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  margin-bottom: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

const Body = styled.div`
  flex: 1;
  padding: 5px 8px;
  background-color: #f5f5f5;
`;
const UsageStatusLabel = styled(Label)`
  margin-left: 4px;
`;
