"use client";

import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { useGetGpuNodes } from "@/shared/hooks/use-get-gpu-nodes";
import type { GpuListType, GpuNodeListType } from "@/shared/schemas/gpu.schema";
import { gpuAtom, gpuNodeAtom } from "../../state/create-workload.atom";
import { GpuCard } from "./gpu-card";
import { GpuNodeCard } from "./gpu-node-card";

interface CreateWorkloadGpuNormalProps {
  type: "NORMAL" | "MPS";
  gpus: GpuListType[];
  isSelected: boolean;
  onClickGpu: (gpu: GpuListType) => void;
}

export function CreateWorkloadGpuNormal({
  type,
  gpus,
  isSelected,
  onClickGpu,
}: CreateWorkloadGpuNormalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const gpu = useAtomValue(gpuAtom);
  const [gpuNode, setGpuNode] = useAtom(gpuNodeAtom);

  const { data } = useGetGpuNodes();

  const handleClickGpuNode = (node: GpuNodeListType) => {
    setGpuNode(node);
  };

  return (
    <Container>
      <Header>
        <Title>{type === "NORMAL" ? "GPU" : "MPS"}</Title>
        <Total>총 {gpus.length}개</Total>
      </Header>
      {/* GPU 목록 */}
      <GpuBody>
        {gpus.map((v) => (
          <GpuCard
            key={v.id}
            isSelected={gpu?.id === v.id}
            onClick={onClickGpu}
            {...v}
          />
        ))}
      </GpuBody>
      {isSelected && (
        <GpuNode>
          <GpuNodeHeader>
            <GpuNodeHeaderLeft>
              <Typography.Text variant="body-2-2" color="#484848">
                GPU {type === "NORMAL" ? "사용 노드 선택" : ""}
              </Typography.Text>
              {type !== "NORMAL" && (
                <>
                  <Divider />
                  <Typography.Text variant="body-2-2" color="#484848">
                    {type} 선택
                  </Typography.Text>
                </>
              )}
            </GpuNodeHeaderLeft>
            <IconWrapper
              className={classNames({ active: isOpen })}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon name="Dropdown" color="var(--icon-fill)" size={14} />
            </IconWrapper>
          </GpuNodeHeader>
          {/* GPU 노드 목록 */}
          <GpuNodeBody className={classNames({ active: isOpen })}>
            {data?.content.map((node) => (
              <GpuNodeCard
                key={node.id}
                isSelected={gpuNode?.id === node.id}
                onClick={handleClickGpuNode}
                {...node}
              />
            ))}
          </GpuNodeBody>
        </GpuNode>
      )}
    </Container>
  );
}

const Title = styled(Typography.Text).attrs({
  variant: "body-2-2",
  color: "#000",
})`
`;

const Total = styled(Typography.Text).attrs({
  variant: "body-3-3",
  color: "#484848",
})`
  line-height: 16px;
`;

const GpuBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
`;

const GpuNode = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const GpuNodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const GpuNodeHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const GpuNodeBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  max-height: 0;
  margin-top: 0;
  overflow: hidden;

  &.active {
    max-height: 100%;
    margin-top: 8px;
  }
`;

// GPU 섹션 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  position: relative;
`;

const Divider = styled.div`
  width: 1px;
  height: 10px;
  background-color: #d2d4dc;
  margin: 0 4px;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;

  --icon-fill: #404040;

  &.active {
    transform: rotate(180deg);
  }
`;
