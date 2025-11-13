import styled from "styled-components";

import { subTitleStyle } from "../mixins/text";

export const AsideListArticleHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--column-gutter-size);
`;

export const AsideListArticleTitle = styled.h3`
  ${subTitleStyle(6)}

  font-size: 16px;
  line-height: 24px;
  margin-left: 6px;
`;

export const AsideListArticleDescription = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: #000;
`;
