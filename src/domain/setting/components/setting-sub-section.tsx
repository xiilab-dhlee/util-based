import styled from "styled-components";

import { SettingCredentialArticle } from "./setting-credential-article";
import { SettingRequestResourceArticle } from "./setting-request-resource-article";

/**
 * 설정 하위 섹션 컴포넌트
 *
 * 리소스 요청 목록과 크리덴셜 목록을 나란히 표시합니다.
 * Section 내에 독립적인 Article들로 구성됩니다.
 */
export function SettingSubSection() {
  return (
    <Container>
      <Left>
        <SettingRequestResourceArticle />
      </Left>
      <Right>
        <SettingCredentialArticle />
      </Right>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 492px;
`;

const Left = styled.article`
  flex: 0;
  flex-basis: 964px;
  height: 100%;
  padding: 23px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
`;

const Right = styled(Left)`
  flex: 1;
  padding-bottom: 23px;
`;
