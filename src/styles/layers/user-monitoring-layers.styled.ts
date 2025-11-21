import styled from "styled-components";
import { Typography } from "xiilab-ui";

export const UserMonitoringSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

export const UserMonitoringSectionTitle = styled.h2`
  position: relative;
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  color: #fff;

  &:not(.no-line)::before {
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translateY(-50%);
    height: 90%;
    content: "";
    width: 2px;
    background-color: #6567e5;
  }

  &.light {
    color: #f5f5f5;
  }

  &.dark {
    color: #070913;
  }
`;

export const UserMonitoringSectionDescription = styled.p`
  font-size: 12px;
  line-height: 14px;
  height: 14px;
  font-weight: 400;
  color: #bdbdbd;
`;

export const UserMonitoringCategoryTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2",
})`
  color: #f5f5f5;
`;
