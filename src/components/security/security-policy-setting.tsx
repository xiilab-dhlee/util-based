"use client";

import { useState } from "react";
import styled from "styled-components";
import type { TypographyVariant } from "xiilab-ui";
import { Switch, Typography } from "xiilab-ui";

interface SecurityPolicySettingProps {
  title: string;
  descriptions: {
    variant: TypographyVariant;
    content: string;
  }[];
}

export function SecurityPolicySetting({
  title,
  descriptions,
}: SecurityPolicySettingProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
  };

  return (
    <Container>
      <Header>
        <Typography.Text variant="body-1-1">{title}</Typography.Text>
        <Switch checked={checked} onChange={handleChange} />
      </Header>
      <Body>
        {descriptions.map(({ variant, content }, i) => (
          <Typography.Text variant={variant} color="#484848" key={i}>
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

const Body = styled.div`
  flex: 1;
  padding: 5px 8px;
  background-color: #f5f5f5;
`;
