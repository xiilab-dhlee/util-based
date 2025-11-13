"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button, Card, Icon, Input, Modal } from "xiilab-ui";

interface WorkloadItem {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  selected: boolean;
}

interface CreateContainerImageModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; tag: string; workloads: string[] }) => void;
  title?: string;
}

export function CreateContainerImageModal({
  open,
  onClose,
  onSubmit,
  title = "컨테이너 이미지 생성",
}: CreateContainerImageModalProps) {
  const [imageName, setImageName] = useState("");
  const [tag, setTag] = useState("");
  const [searchText, setSearchText] = useState("");
  const [workloads, setWorkloads] = useState<WorkloadItem[]>([
    {
      id: "1",
      name: "AstraGo-workspace-test",
      type: "Interactive",
      status: "실행중",
      createdAt: "2025.06.15",
      selected: false,
    },
    {
      id: "2",
      name: "AstraGo-workspace-test",
      type: "Interactive",
      status: "실행중",
      createdAt: "2025.06.15",
      selected: false,
    },
    {
      id: "3",
      name: "AstraGo-workspace-test",
      type: "Interactive",
      status: "실행중",
      createdAt: "2025.06.15",
      selected: false,
    },
    {
      id: "4",
      name: "AstraGo-workspace-test",
      type: "Interactive",
      status: "실행중",
      createdAt: "2025.06.15",
      selected: false,
    },
    {
      id: "5",
      name: "AstraGo-workspace-test",
      type: "Interactive",
      status: "실행중",
      createdAt: "2025.06.15",
      selected: false,
    },
    {
      id: "6",
      name: "AstraGo-workspace-test",
      type: "Interactive",
      status: "실행중",
      createdAt: "2025.06.15",
      selected: false,
    },
  ]);

  const handleWorkloadToggle = (id: string) => {
    setWorkloads((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const handleSubmit = () => {
    const selectedWorkloads = workloads
      .filter((w) => w.selected)
      .map((w) => w.id);

    onSubmit({
      name: imageName,
      tag,
      workloads: selectedWorkloads,
    });

    // Reset form
    setImageName("");
    setTag("");
    setSearchText("");
    setWorkloads((prev) => prev.map((w) => ({ ...w, selected: false })));
    onClose();
  };

  const filteredWorkloads = workloads.filter((w) =>
    w.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={
        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SubmitButton
            color="primary"
            onClick={handleSubmit}
            disabled={!imageName || !tag || !workloads.some((w) => w.selected)}
          >
            등록
          </SubmitButton>
        </ModalFooter>
      }
      closable={true}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={14} />}
      modalWidth={580}
      centered
      showHeaderBorder={true}
    >
      <ModalContainer>
        <ModalBody>
          <FormSection>
            <Label>
              컨테이너 이미지 이름
              <Required>*</Required>
            </Label>
            <StyledInput
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="컨테이너 이미지 이름을 입력해 주세요."
              style={{ width: "100%" }}
            />
          </FormSection>

          <FormSection>
            <LabelWrapper>
              <Label>
                태그
                <Required>*</Required>
              </Label>
              <RecentTags>
                최근 생성 태그:
                <TagChip>v1.0</TagChip>
              </RecentTags>
            </LabelWrapper>
            <StyledInput
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="태그를 입력해 주세요. (문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능)"
              style={{ width: "100%" }}
            />
          </FormSection>

          <FormSection>
            <Label>
              워크로드 선택
              <Required>*</Required>
            </Label>
            <WorkloadContainer>
              <WorkloadContent>
                <SearchContainer>
                  <Input.Search
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="워크로드 이름을 입력해 주세요."
                    style={{ width: "100%" }}
                  />
                </SearchContainer>
                <WorkloadListContainer>
                  <WorkloadList>
                    {filteredWorkloads.map((workload) => (
                      <Card
                        key={workload.id}
                        title={workload.name}
                        width="calc(50% - 4px)"
                        height={138}
                        checked={workload.selected}
                        onCheckboxChange={() =>
                          handleWorkloadToggle(workload.id)
                        }
                        showCheckBox={true}
                      >
                        <div>
                          <p>타입: {workload.type}</p>
                          <p>상태: {workload.status}</p>
                          <p>생성일: {workload.createdAt}</p>
                        </div>
                      </Card>
                    ))}
                  </WorkloadList>
                </WorkloadListContainer>
              </WorkloadContent>
            </WorkloadContainer>
          </FormSection>
        </ModalBody>
      </ModalContainer>
    </Modal>
  );
}


const ModalContainer = styled.div`
  position: relative;
`;

const ModalBody = styled.div`
  padding-top: 12px;
`;

const FormSection = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
`;

const Required = styled.span`
  color: #ff2c2c;
  font-weight: 700;
  margin-left: 2px;
`;

const StyledInput = styled(Input)`
  background: #f3f5f7;
  border: 1px solid #ced2d6;
  border-radius: 2px;
  height: 30px;
  font-size: 12px;

  &:focus {
    border-color: #7095ff;
  }

  &::placeholder {
    color: #555555;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const RecentTags = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #9ca0ab;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TagChip = styled.span`
  padding: 3px 9px;
  background: #fafafa;
  border: 1px solid #c1c7ce;
  border-radius: 2px;
  font-size: 12px;
  color: #171b26;
`;

const WorkloadContainer = styled.div`
  position: relative;
  background: white;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  height: 404px;
  margin-top: 4px;
  overflow: hidden;
`;

const WorkloadContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 14px;
`;

const SearchContainer = styled.div`
  flex-shrink: 0;
`;

const WorkloadListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-right: -6px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #dddddd;
    border-radius: 3px;
  }
`;

const WorkloadList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-right: 2px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 0 20px 20px;
`;

const CancelButton = styled(Button)`
  width: 162px;
  height: 34px;
  background-color: #e4e4e8;
  border: none;
  color: #070913;
`;

const SubmitButton = styled(Button)`
  width: 162px;
  height: 34px;
  border: none;
`;
