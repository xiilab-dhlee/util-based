"use client";

import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { CompoundDropdown, Typography } from "xiilab-ui";

import type { CoreNodeMode } from "@/shared/types/core.interface";

interface ResourcePresetSelectProps {
  nodeMode: CoreNodeMode;
  preset: string;
  setPreset: Dispatch<SetStateAction<string>>;
}

export function ResourcePresetSelect({
  nodeMode,
  preset,
  setPreset,
}: ResourcePresetSelectProps) {
  return (
    <CompoundDropdown
      theme="light"
      width="100%"
      height={30}
      placeholder="리소스 프리셋을 선택하세요"
      value={preset}
      onChange={(value) => setPreset(value as string)}
    >
      <CompoundDropdown.Option value="custom" display="사용자 설정 리소스 할당">
        <ResourcePresetOptionContainer>
          <Typography.Text
            variant={preset === "custom" ? "body-2-2" : "body-2-4"}
            color={preset === "custom" ? "#382CE0" : "#000000"}
          >
            사용자 설정 리소스 할당
          </Typography.Text>
        </ResourcePresetOptionContainer>
      </CompoundDropdown.Option>

      <CompoundDropdown.Option value="small" display="SMALL">
        {nodeMode === "multi" ? (
          <MultiNodePresetOption>
            <Typography.Text variant="body-2-4" color="#000000">
              SMALL
            </Typography.Text>
            <PresetSpecsContainer>
              <PresetSpecsRow $width={176}>
                <PresetSection $bgColor="#E6F5F4">
                  <Typography.Text variant="body-4-1" color="#000000">
                    Launcher
                  </Typography.Text>
                </PresetSection>
                <PresetSectionDivider />
                <PresetResourceGroup>
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      CPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      3Core
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      MEM
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      5GB
                    </Typography.Text>
                  </PresetResourceItem>
                </PresetResourceGroup>
              </PresetSpecsRow>
              <PresetSpecsRow $width={223}>
                <PresetSection $bgColor="#E7F6FF">
                  <Typography.Text variant="body-4-1" color="#000000">
                    Worker
                  </Typography.Text>
                </PresetSection>
                <PresetSectionDivider />
                <PresetResourceGroup>
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      GPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      2개
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      CPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      2Core
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      MEM
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      4GB
                    </Typography.Text>
                  </PresetResourceItem>
                </PresetResourceGroup>
              </PresetSpecsRow>
            </PresetSpecsContainer>
          </MultiNodePresetOption>
        ) : (
          <ResourcePresetOptionContainer>
            <Typography.Text
              variant={preset === "small" ? "body-2-2" : "body-2-4"}
              color={preset === "small" ? "#382CE0" : "#000000"}
            >
              SMALL
            </Typography.Text>
            <ResourceSpecsContainer>
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  GPU
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  1개
                </Typography.Text>
              </ResourceSpecItem>
              <ResourceSpecDivider />
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  CPU
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  2Core
                </Typography.Text>
              </ResourceSpecItem>
              <ResourceSpecDivider />
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  MEM
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  4GB
                </Typography.Text>
              </ResourceSpecItem>
            </ResourceSpecsContainer>
          </ResourcePresetOptionContainer>
        )}
      </CompoundDropdown.Option>

      <CompoundDropdown.Option value="medium" display="MEDIUM">
        {nodeMode === "multi" ? (
          <MultiNodePresetOption>
            <Typography.Text variant="body-2-4" color="#000000">
              MEDIUM
            </Typography.Text>
            <PresetSpecsContainer>
              <PresetSpecsRow $width={176}>
                <PresetSection $bgColor="#E6F5F4">
                  <Typography.Text variant="body-4-1" color="#000000">
                    Launcher
                  </Typography.Text>
                </PresetSection>
                <PresetSectionDivider />
                <PresetResourceGroup>
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      CPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      3Core
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      MEM
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      7GB
                    </Typography.Text>
                  </PresetResourceItem>
                </PresetResourceGroup>
              </PresetSpecsRow>
              <PresetSpecsRow $width={223}>
                <PresetSection $bgColor="#E7F6FF">
                  <Typography.Text variant="body-4-1" color="#000000">
                    Worker
                  </Typography.Text>
                </PresetSection>
                <PresetSectionDivider />
                <PresetResourceGroup>
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      GPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      3개
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      CPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      4Core
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      MEM
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      8GB
                    </Typography.Text>
                  </PresetResourceItem>
                </PresetResourceGroup>
              </PresetSpecsRow>
            </PresetSpecsContainer>
          </MultiNodePresetOption>
        ) : (
          <ResourcePresetOptionContainer>
            <Typography.Text
              variant={preset === "medium" ? "body-2-2" : "body-2-4"}
              color={preset === "medium" ? "#382CE0" : "#000000"}
            >
              MEDIUM
            </Typography.Text>
            <ResourceSpecsContainer>
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  GPU
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  2개
                </Typography.Text>
              </ResourceSpecItem>
              <ResourceSpecDivider />
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  CPU
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  4Core
                </Typography.Text>
              </ResourceSpecItem>
              <ResourceSpecDivider />
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  MEM
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  8GB
                </Typography.Text>
              </ResourceSpecItem>
            </ResourceSpecsContainer>
          </ResourcePresetOptionContainer>
        )}
      </CompoundDropdown.Option>

      <CompoundDropdown.Option value="large" display="LARGE">
        {nodeMode === "multi" ? (
          <MultiNodePresetOption>
            <Typography.Text variant="body-2-4" color="#000000">
              LARGE
            </Typography.Text>
            <PresetSpecsContainer>
              <PresetSpecsRow $width={176}>
                <PresetSection $bgColor="#E6F5F4">
                  <Typography.Text variant="body-4-1" color="#000000">
                    Launcher
                  </Typography.Text>
                </PresetSection>
                <PresetSectionDivider />
                <PresetResourceGroup>
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      CPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      5Core
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      MEM
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      10GB
                    </Typography.Text>
                  </PresetResourceItem>
                </PresetResourceGroup>
              </PresetSpecsRow>
              <PresetSpecsRow $width={223}>
                <PresetSection $bgColor="#E7F6FF">
                  <Typography.Text variant="body-4-1" color="#000000">
                    Worker
                  </Typography.Text>
                </PresetSection>
                <PresetSectionDivider />
                <PresetResourceGroup>
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      GPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      4개
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      CPU
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      8Core
                    </Typography.Text>
                  </PresetResourceItem>
                  <PresetResourceDivider />
                  <PresetResourceItem>
                    <Typography.Text variant="body-4-1" color="#22212A">
                      MEM
                    </Typography.Text>
                    <Typography.Text variant="body-4-2" color="#22212A">
                      16GB
                    </Typography.Text>
                  </PresetResourceItem>
                </PresetResourceGroup>
              </PresetSpecsRow>
            </PresetSpecsContainer>
          </MultiNodePresetOption>
        ) : (
          <ResourcePresetOptionContainer>
            <Typography.Text
              variant={preset === "large" ? "body-2-2" : "body-2-4"}
              color={preset === "large" ? "#382CE0" : "#000000"}
            >
              LARGE
            </Typography.Text>
            <ResourceSpecsContainer>
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  GPU
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  4개
                </Typography.Text>
              </ResourceSpecItem>
              <ResourceSpecDivider />
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  CPU
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  8Core
                </Typography.Text>
              </ResourceSpecItem>
              <ResourceSpecDivider />
              <ResourceSpecItem>
                <Typography.Text variant="body-4-1" color="#22212A">
                  MEM
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  16GB
                </Typography.Text>
              </ResourceSpecItem>
            </ResourceSpecsContainer>
          </ResourcePresetOptionContainer>
        )}
      </CompoundDropdown.Option>
    </CompoundDropdown>
  );
}

// CompoundDropdown 스타일드 컴포넌트들
const ResourcePresetOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0;
`;

const ResourceSpecsContainer = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 400 weight
})`
  display: flex;
  align-items: center;
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  border-radius: 2px;
  padding: 2px 6px;
  gap: 6px;
  margin-left: auto;
  height: 22px;
`;

const ResourceSpecItem = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const ResourceSpecDivider = styled.div`
  width: 1px;
  height: 8px;
  background-color: #e0e0e0;
`;

const MultiNodePresetOption = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 34px;
  padding: 0;
`;

const PresetSpecsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-left: auto;
`;

const PresetSpecsRow = styled.div<{ $width?: number }>`
  display: flex;
  align-items: center;
  height: 22px;
  width: ${(props) => (props.$width ? `${props.$width}px` : "auto")};
  border: 1px solid #c1c7ce;
  border-radius: 2px;
  background-color: #fafafa;
  flex-shrink: 0;
`;

const PresetSection = styled.div<{ $bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  height: 20px;
  background-color: ${(props) => props.$bgColor};
  border-radius: 1px 0 0 1px;
  margin: 1px;
  margin-right: 0;
`;

const PresetSectionDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: #c1c7ce;
`;

const PresetResourceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 6px;
  flex: 1;
`;

const PresetResourceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  & > span:first-child {
    min-width: 26px;
  }
`;

const PresetResourceDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #e0e0e0;
  margin: 0 6px;
`;
