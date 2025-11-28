"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Icon, Input, Typography } from "xiilab-ui";

import {
  batchSizeAtom,
  epochAtom,
  imageSizeAtom,
  modelParameterAtom,
  trainImageNumAtom,
  validationImageNumAtom,
} from "../../state/create-workload.atom";

export function CreateWorkloadParameter() {
  const [trainImageNum, setTrainImageNum] = useAtom(trainImageNumAtom);
  const [batchSize, setBatchSize] = useAtom(batchSizeAtom);
  const [validationImageNum, setValidationImageNum] = useAtom(
    validationImageNumAtom,
  );
  const [modelParameter, setModelParameter] = useAtom(modelParameterAtom);
  const [imageSize, setImageSize] = useAtom(imageSizeAtom);
  const [epoch, setEpoch] = useAtom(epochAtom);

  const estimatedTime = "3시간 57분";

  return (
    <>
      <ParameterGrid>
        {/* train_image_num */}
        <ParameterItem>
          <ParameterLabel>
            <Typography.Text variant="body-2-1" color="#484848">
              train_image_num
            </Typography.Text>
          </ParameterLabel>
          <ParameterInput
            value={trainImageNum || ""}
            onChange={(e) => setTrainImageNum(e.target.value)}
          />
        </ParameterItem>

        {/* validation_image_num */}
        <ParameterItem>
          <ParameterLabel>
            <Typography.Text variant="body-2-1" color="#484848">
              validation_image_num
            </Typography.Text>
          </ParameterLabel>
          <ParameterInput
            value={validationImageNum || ""}
            onChange={(e) => setValidationImageNum(e.target.value)}
          />
        </ParameterItem>

        {/* image_size */}
        <ParameterItem>
          <ParameterLabel>
            <Typography.Text variant="body-2-1" color="#484848">
              image_size
            </Typography.Text>
          </ParameterLabel>
          <ParameterInput
            value={imageSize || ""}
            onChange={(e) => setImageSize(e.target.value)}
          />
        </ParameterItem>

        {/* batch_size */}
        <ParameterItem>
          <ParameterLabel>
            <Typography.Text variant="body-2-1" color="#484848">
              batch_size
            </Typography.Text>
          </ParameterLabel>
          <ParameterInput
            value={batchSize || ""}
            onChange={(e) => setBatchSize(e.target.value)}
          />
        </ParameterItem>

        {/* model_parameter */}
        <ParameterItem>
          <ParameterLabel>
            <Typography.Text variant="body-2-1" color="#484848">
              model_parameter
            </Typography.Text>
          </ParameterLabel>
          <ParameterInput
            value={modelParameter || ""}
            onChange={(e) => setModelParameter(e.target.value)}
          />
        </ParameterItem>

        {/* epoch */}
        <ParameterItem>
          <ParameterLabel>
            <Typography.Text variant="body-2-1" color="#484848">
              epoch
            </Typography.Text>
          </ParameterLabel>
          <ParameterInput
            value={epoch || ""}
            onChange={(e) => setEpoch(e.target.value)}
          />
        </ParameterItem>
      </ParameterGrid>

      {/* 워크로드 종료 예상 시간 */}
      <EstimatedTimeContainer>
        <EstimatedTimeOuter>
          <EstimatedTimeInner>
            <IconCircle>
              <Icon name="FinishTime" size={18} color="#FFFFFF" />
            </IconCircle>
            <Typography.Text variant="subtitle-2-1" color="#000000">
              워크로드 종료 예상 시간
            </Typography.Text>
            <EstimatedTimeValue>
              <Typography.Text variant="subtitle-2-1" color="#00195F">
                {estimatedTime}
              </Typography.Text>
            </EstimatedTimeValue>
          </EstimatedTimeInner>
        </EstimatedTimeOuter>
      </EstimatedTimeContainer>
    </>
  );
}

const ParameterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 12px;
`;

const ParameterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ParameterLabel = styled.div`
  display: flex;
  align-items: center;
`;

const ParameterInput = styled(Input)`
  width: 100%;
  height: 30px;
`;

const EstimatedTimeContainer = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const EstimatedTimeOuter = styled.div`
  width: 100%;
  padding: 2px;
  background: rgba(54, 107, 255, 0.2);
  border-radius: 3px;
`;

const EstimatedTimeInner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 46px;
  padding: 0 20px 0 10px;
  background: #f5f9ff;
  border: 1px solid #3d3fdf;
  border-radius: 2px;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #3744f9;
  border-radius: 14px;
  flex-shrink: 0;
`;

const EstimatedTimeValue = styled.div`
  margin-left: auto;
`;
