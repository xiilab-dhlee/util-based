import styled from "styled-components";

export const PanelContainer = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

export const PanelTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

export const PanelBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const PanelFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`;

export const Article = styled.article`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  padding: 20px 22px;
  background-color: #fcfcfc;
  border-radius: 4px;

  & + & {
    margin-top: 10px;
  }
`;

export const ArticleTitle = styled(PanelTitle)`
  margin-bottom: 16px;
`;

export const ArticleBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  & + & {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
    margin-top: 20px;
  }
`;

export const ArticlePane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  & + & {
    border-left: 1px solid #e0e0e0;
    padding-left: 24px;
  }
`;

export const ArticleRecord = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & + & {
    margin-top: 10px;
  }
`;

export const ArticleKey = styled.div`
  width: 100px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #484848;
`;

export const ArticleValue = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

export const Tag = styled.div`
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  padding: 0 8px;
  color: #171b26;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #828588;
  font-size: 14px;
`;
