"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

/**
 * 워크스페이스 리소스 할당량 카드 컴포넌트
 *
 * 워크스페이스의 리소스 할당량 정보를 표시하고 수정할 수 있습니다.
 * GPU, CPU, MEM의 할당량을 프로그레스 바와 입력 필드로 보여주며,
 * MIG(Multi-Instance GPU) 설정도 포함합니다.
 */
export function WorkspaceResourceAllocCard() {
  // 편집 모드 상태 관리
  const [isEditMode, setIsEditMode] = useState(false);

  const handleClickEdit = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <>
      {/* 리소스 할당량 카드 컨테이너 */}
      <Container>
        {/* 카드 헤더: 제목과 편집 버튼 */}
        <Header>
          <Title>리소스 할당량</Title>
          <div>
            <span className="sr-only">리소스 할당량 수정</span>
          </div>
          <Button
            icon="Edit02"
            width={26}
            height={26}
            iconSize={20}
            onClick={handleClickEdit}
          />
        </Header>

        {/* 기본 리소스 할당량 섹션 */}
        <Body>
          <Resources>
            {/* GPU 리소스 할당량 */}
            <Resource>
              <ResourceKey>GPU</ResourceKey>
              <ResourceBody>
                <ResourceProgressBar>
                  <ResourceProgress className="gpu" />
                </ResourceProgressBar>
                <ResourceLimit>5</ResourceLimit>
              </ResourceBody>
              <ResourceValue
                value={isEditMode ? "4" : "4개"}
                readOnly={!isEditMode}
              />
            </Resource>

            {/* CPU 리소스 할당량 */}
            <Resource>
              <ResourceKey>CPU</ResourceKey>
              <ResourceBody>
                <ResourceProgressBar>
                  <ResourceProgress className="cpu" />
                </ResourceProgressBar>
                <ResourceLimit>200</ResourceLimit>
              </ResourceBody>
              <ResourceValue
                value={isEditMode ? "102" : "102Core"}
                readOnly={!isEditMode}
              />
            </Resource>

            {/* MEM 리소스 할당량 */}
            <Resource>
              <ResourceKey>MEM</ResourceKey>
              <ResourceBody>
                <ResourceProgressBar>
                  <ResourceProgress className="mem" />
                </ResourceProgressBar>
                <ResourceLimit>23</ResourceLimit>
              </ResourceBody>
              <ResourceValue
                value={isEditMode ? "102" : "102GB"}
                readOnly={!isEditMode}
              />
            </Resource>
          </Resources>
        </Body>

        {/* MIG(Multi-Instance GPU) 설정 섹션 */}
        <Body>
          <BodyHeader>
            <BodyHeaderTitle>
              <span>GPU</span>
              <BodyHeaderTitleDivdier />
              <span>MIG</span>
            </BodyHeaderTitle>
          </BodyHeader>
          <Resources>
            {/* 1g.12gb MIG 설정 */}
            <Resource>
              <ResourceKey>1g.12gb</ResourceKey>
              <ResourceBody>
                <ResourceProgressBar>
                  <ResourceProgress className="mig" />
                </ResourceProgressBar>
                <ResourceLimit>5</ResourceLimit>
              </ResourceBody>
              <ResourceValue
                value={isEditMode ? "4" : "4개"}
                readOnly={!isEditMode}
              />
            </Resource>

            {/* 2g.24gb MIG 설정 */}
            <Resource>
              <ResourceKey>2g.24gb</ResourceKey>
              <ResourceBody>
                <ResourceProgressBar>
                  <ResourceProgress className="mig" />
                </ResourceProgressBar>
                <ResourceLimit>200</ResourceLimit>
              </ResourceBody>
              <ResourceValue
                value={isEditMode ? "4" : "4개"}
                readOnly={!isEditMode}
              />
            </Resource>
          </Resources>
        </Body>
      </Container>
    </>
  );
}


// ============================================================================
// Styled Components
// ============================================================================

/**
 * 리소스 할당량 카드 메인 컨테이너
 * 카드의 전체 레이아웃과 스타일을 정의합니다.
 */
const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 7px;
  padding-top: 1px;
  background-color: #fcfcfc;
  padding: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);

  --border-color: #e0e0e0;
`;

/**
 * 카드 헤더 스타일
 * 제목과 편집 버튼을 좌우로 배치합니다.
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * 카드 제목 스타일
 * "리소스 할당량" 텍스트의 스타일을 정의합니다.
 */
const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  height: 16px;
`;

const Body = styled.div`
  flex: 1;
  border: 1px solid #d1d5dc;
  background-color: #fafafa;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  --border-color: #d1d5dc;

  & + & {
    margin-top: 3px;
  }
`;

const BodyHeader = styled.div`
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 10px;
`;

const BodyHeaderTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const BodyHeaderTitleDivdier = styled.div`
  width: 1.5px;
  height: 10px;
  background-color: var(--border-color);
`;

const Resources = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Resource = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  gap: 6px;
`;

const ResourceKey = styled.div`
  color: #000;
  width: 45px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ResourceBody = styled.div`
  width: 176px;
  border-radius: 2px;
  border: 1px solid var(--border-color);
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
`;

const ResourceValue = styled.input`
  width: 60px;
  border-radius: 2px;
  border: 1px solid var(--border-color);
  height: 100%;
  padding: 0 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ResourceLimit = styled.span`
  font-weight: 400;
  font-size: 11px;
  color: #555555;
  text-align: center;
`;

const ResourceProgressBar = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 4px;
  background-color: #eaeaea;
  box-shadow:
    0px 1px 1px 0px #808e9724 inset,
    0px 0px 4px 0px #ffffff40;
  overflow: hidden;
`;

const ResourceProgress = styled.div`
  width: 70%;
  height: 100%;
  background-color: var(--bg-color);
  border-radius: 4px;

  &.gpu {
    --bg-color: #a353ff;
  }

  &.cpu {
    --bg-color: #376dff;
  }

  &.mem {
    --bg-color: #55d398;
  }

  &.mig {
    --bg-color: #d646ec;
  }
`;
