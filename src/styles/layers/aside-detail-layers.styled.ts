import styled, { css } from "styled-components";

const asideDetailContainerStyle = (isFloat?: boolean) => css`
  flex: 1;
  height: 100%;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
  // 닫기 가능한 형태
  ${
    isFloat &&
    css`
    border: 1px solid #544ad8;
  `
  }

  --column-gutter-size: 20px;
`;

const asideDetailArticleStyle = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  padding: 20px;

  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;
`;

export const AsideDetailForm = styled.form<{ $isFloat?: boolean }>`
  ${({ $isFloat }) => asideDetailContainerStyle($isFloat)}
`;

export const AsideDetailContainer = styled.div<{ $isFloat?: boolean }>`
  ${({ $isFloat }) => asideDetailContainerStyle($isFloat)}
`;

export const AsideDetailEmpty = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AsideDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const AsideDetailHeaderTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  color: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;

  --icon-fill: #5b29c7;
`;

export const AsideDetailFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  height: 34px;
  margin-top: var(--column-gutter-size);
`;

export const AsideDetailArticle = styled.article`
  ${asideDetailArticleStyle}
`;

export const AsideDetailArticleForm = styled.form`
  ${asideDetailArticleStyle}
`;

export const AsideDetailArticleHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
`;

export const AsideDetailArticleTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  color: #000;
`;

export const AsideDetailArticleBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AsideDetailArticleItem = styled.div`
  display: flex;
  flex-direction: column;

  & + & {
    margin-top: var(--column-gutter-size);
    padding-top: var(--column-gutter-size);
    border-top: 1px solid #e0e0e0;
  }
`;

export const AsideDetailArticleColumn = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  width: 100%;

  & + & {
    margin-top: 14px;
  }
`;

export const AsideDetailArticleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  width: 100%;
`;

export const AsideDetailArticleRowItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  & + & {
    border-left: 1px solid #e0e0e0;
    padding-left: 22px;
  }
`;

export const AsideDetailArticleKey = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  width: 80px;
`;

export const AsideDetailArticleValue = styled.div`
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  overflow: hidden;
  word-wrap: break-word;
`;
