import styled from "styled-components";
import { Typography } from "xiilab-ui";

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #e9e9e9;
  padding: 16px 14px;
  border-radius: 2px;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  min-width: 80px;
`;

export const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
`;

export const ContentText = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  white-space: pre-wrap;
  word-break: break-word;
`;
