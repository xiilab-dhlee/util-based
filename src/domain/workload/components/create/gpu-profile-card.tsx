"use client";

import styled from "styled-components";
import { Card, Typography } from "xiilab-ui";

import type { GpuProfileListType } from "@/shared/schemas/gpu.schema";

interface GpuProfileCardProps extends GpuProfileListType {
  isSelected: boolean;
  onClick: (gpuProfile: GpuProfileListType) => void;
}

export function GpuProfileCard({
  isSelected,
  onClick,
  ...props
}: GpuProfileCardProps) {
  const { name, total, used } = props;

  return (
    <Card
      title={name}
      subtitle={`전체 ${total}개`}
      width="100%"
      height={74}
      style={{ borderColor: isSelected ? "#366BFF" : "" }}
      onClick={() => onClick(props)}
    >
      <CardContent>
        <CardBridge>
          <CardBody>
            <CardLeft>
              <Typography.Text variant="body-3-1" color="#191B26">
                사용가능 GPU
              </Typography.Text>
              <CardDivider />
              <Typography.Text variant="body-3-1" color="#191B26">
                {total}개
              </Typography.Text>
            </CardLeft>
            <CardRight>
              <Typography.Text variant="body-3-1" color="#191B26">
                사용중 GPU
              </Typography.Text>
              <CardDivider />
              <Typography.Text variant="body-3-1" color="#191B26">
                {used}개
              </Typography.Text>
            </CardRight>
          </CardBody>
        </CardBridge>
      </CardContent>
    </Card>
  );
}

const CardBody = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  min-width: 100px;
  justify-content: flex-end;
`;

const CardLeft = styled.div`
  background: #f5f9ff;
  border: 1px solid #8eb5ff;
  border-radius: 2px;
  padding: 4px 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  text-align: center;
  width: 116px;
  height: 26px;
  justify-content: center;
`;

const CardRight = styled.div`
  background: #fcfaff;
  border: 1px solid #bb9cff;
  border-radius: 2px;
  padding: 4px 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  text-align: center;
  width: 116px;
  height: 26px;
  justify-content: center;
`;

const CardDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #d2d4dc;
`;

// Card 내부 레이아웃을 위한 새 컴포넌트들
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 6px;
  padding: 0 4px;
  overflow: hidden;
`;

const CardBridge = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex: 1;
  align-items: flex-start;
`;
