import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { requiredTextStyle } from "@/styles/mixins/text";

/**
 * 소스코드 폼 필드 라벨
 * 필드의 라벨을 표시하는 스타일
 */
export const CreateWorkloadSectionTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
  color: "#000",
  as: "span",
})`
font-weight: 600;
font-size: 14px;
line-height: 16px;

  ${requiredTextStyle}
`;
