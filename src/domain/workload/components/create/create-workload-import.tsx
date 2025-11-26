"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openSelectWorkloadModalAtom } from "@/shared/state/modal.atom";

interface CreateWorkloadImportProps {
  workspaceName: string;
}

export function CreateWorkloadInport({
  workspaceName,
}: CreateWorkloadImportProps) {
  const { onOpen } = useGlobalModal(openSelectWorkloadModalAtom);

  const handleClickRecentWorkload = () => {
    alert("준비 중입니다.");
  };

  const handleClickLoadWorkload = () => {
    onOpen();
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>워크스페이스</HeaderTitle>
        <WorkspaceName>{workspaceName}</WorkspaceName>
      </Header>
      <Body>
        <BodyTitle>기존 워크로드 정보 가져오기</BodyTitle>
        <Buttons>
          <Button onClick={handleClickRecentWorkload}>
            <Typography.Text variant="button-1" color="var(--color-gray-01)">
              최근 워크로드 가져오기
            </Typography.Text>
          </Button>
          <Button onClick={handleClickLoadWorkload}>
            <Typography.Text variant="button-1" color="var(--color-gray-01)">
              워크로드 목록에서 가져오기
            </Typography.Text>
          </Button>
        </Buttons>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid var(--color-gray-10);
  background: var(--color-gray-17);
  padding: 14px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 14px;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  color: #000;
  margin-bottom: 4px;
`;

const WorkspaceName = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #000;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  color: #000;
  margin-bottom: 8px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  height: 30px;
  background: var(--color-gray-17);
  border: 1px solid var(--color-gray-09);
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 2px 0px rgba(127, 140, 166, 0.12);

  &:hover {
    background: var(--color-gray-15);
  }

  &:active {
    background: var(--color-gray-13);
  }
`;
