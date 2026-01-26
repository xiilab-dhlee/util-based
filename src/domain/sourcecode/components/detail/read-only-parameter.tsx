"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";

interface ReadOnlyParameterProps {
  parameters: SourcecodeParameterType[];
}

/** 소스코드 파라미터를 읽기 전용으로 표시하는 컴포넌트 */
export function ReadOnlyParameter({ parameters }: ReadOnlyParameterProps) {
  const { keys, values } = useMemo(() => {
    const keys = parameters.map((param) => param.key);
    const values = parameters.map((param) => param.value);
    return { keys, values };
  }, [parameters]);

  if (parameters.length === 0) {
    return (
      <Container>
        <EmptyMessage>등록된 파라미터가 없습니다.</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Row>
          <Title>키</Title>
        </Row>
        <Row>
          <Title>값</Title>
        </Row>
      </Header>

      <Body>
        <BodyRow>
          <KeyColumn>
            {keys.map((key) => (
              <Value key={key} className="truncate" title={key}>
                {key}
              </Value>
            ))}
          </KeyColumn>

          <ValueColumn>
            {values.map((value) => (
              <Value key={uuidv4()} className="truncate" title={value}>
                {value}
              </Value>
            ))}
          </ValueColumn>
        </BodyRow>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #c1c7ce;
  border-radius: 4px;
  background-color: #f3f5f7;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  overflow: hidden;
`;

const BodyRow = styled.div`
  display: flex;
  width: 100%;
`;

const KeyColumn = styled(Row)`
  flex: 1;
  border-right: 1px solid #e0e0e0;
`;

const ValueColumn = styled(Row)`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
`;

const Value = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 1;
  color: #000;
  padding-bottom: 6px;

  & + & {
    border-top: 1px dashed #dbe1e6;
    padding-top: 6px;
  }
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #878898;
  padding: 12px;
`;
