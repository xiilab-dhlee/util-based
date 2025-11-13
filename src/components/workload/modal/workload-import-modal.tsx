"use client";

import { atom, useAtom } from "jotai";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Table, Typography } from "xiilab-ui";

// 워크로드 목록에서 가져오기 모달 상태 관리
export const workloadImportModalAtom = atom(false);
export const closeWorkloadImportModalAtom = atom(null, (get, set) => {
  set(workloadImportModalAtom, false);
});

// 워크로드 데이터 타입 정의
interface WorkloadItem {
  key: string;
  name: string;
  type: string;
  status: "Running" | "Waiting" | "Completed";
  creator: string;
  elapsed: string;
  model?: string;
}

// 임시 데모 데이터
const mockWorkloads: WorkloadItem[] = [
  {
    key: "1",
    name: "Workload AstraGo01",
    type: "Distributed",
    status: "Running",
    creator: "홍길동",
    elapsed: "1일 전",
    model: "PyTorch",
  },
  {
    key: "2",
    name: "Workload AstraGo02",
    type: "Interactive",
    status: "Waiting",
    creator: "홍길동",
    elapsed: "1일 전",
    model: "TensorFlow",
  },
  {
    key: "3",
    name: "Workload AstraGo03",
    type: "Batch",
    status: "Waiting",
    creator: "홍길동",
    elapsed: "2일 전",
    model: "PyTorch",
  },
  {
    key: "4",
    name: "Workload AstraGo04",
    type: "Interactive",
    status: "Completed",
    creator: "홍길동",
    elapsed: "2일 전",
    model: "TensorFlow",
  },
  {
    key: "5",
    name: "Workload AstraGo05",
    type: "Interactive",
    status: "Completed",
    creator: "홍길동",
    elapsed: "3일 전",
    model: "PyTorch",
  },
  {
    key: "6",
    name: "Workload AstraGo01",
    type: "Batch",
    status: "Running",
    creator: "홍길동",
    elapsed: "3일 전",
    model: "TensorFlow",
  },
  {
    key: "7",
    name: "Workload AstraGo02",
    type: "Interactive",
    status: "Waiting",
    creator: "홍길동",
    elapsed: "3일 전",
    model: "PyTorch",
  },
  {
    key: "8",
    name: "Workload AstraGo03",
    type: "Interactive",
    status: "Waiting",
    creator: "홍길동",
    elapsed: "3일 전",
    model: "TensorFlow",
  },
];

export function WorkloadImportModal() {
  const [isVisible, setIsVisible] = useAtom(workloadImportModalAtom);
  const [selectedWorkload, setSelectedWorkload] = useState<string | null>(null);

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "선택",
      key: "select",
      width: 50,
      align: "center" as const,
      render: (_: any, record: WorkloadItem) => (
        <RadioButton
          checked={selectedWorkload === record.key}
          onChange={() => setSelectedWorkload(record.key)}
          id={`workload-radio-${record.key}`}
          name="workload-selection"
        />
      ),
    },
    {
      title: "워크로드 이름",
      dataIndex: "name",
      key: "name",
      width: 140,
      render: (text: string) => (
        <Typography.Text variant="body-4-2" color="var(--color-gray-01)">
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "잡 타입",
      dataIndex: "type",
      key: "type",
      width: 90,
      align: "center" as const,
      render: (text: string) => (
        <Typography.Text variant="body-4-2" color="var(--color-gray-03)">
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "생성자",
      dataIndex: "creator",
      key: "creator",
      width: 70,
      align: "center" as const,
      render: (text: string) => (
        <Typography.Text variant="body-4-2" color="var(--color-gray-03)">
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 70,
      render: (status: "Running" | "Waiting" | "Completed") => (
        <StatusLabel status={status}>
          <StatusDot status={status} />
          <Typography.Text variant="body-4-2" color="inherit">
            {status === "Running"
              ? "실행중"
              : status === "Waiting"
                ? "대기중"
                : "종료"}
          </Typography.Text>
        </StatusLabel>
      ),
    },
    {
      title: "경과시간",
      dataIndex: "elapsed",
      key: "elapsed",
      width: 70,
      align: "center" as const,
      render: (text: string) => (
        <Typography.Text variant="body-4-2" color="var(--color-gray-04)">
          {text}
        </Typography.Text>
      ),
    },
  ];

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSelectedWorkload(null);
  }, [setIsVisible]);

  const handleImport = useCallback(() => {
    if (selectedWorkload) {
      const workload = mockWorkloads.find((w) => w.key === selectedWorkload);
      if (workload) {
        // TODO: 실제 워크로드 정보 가져오기 로직 구현
        console.log("워크로드 정보 가져오기:", workload);
      }
    }
    handleClose();
  }, [selectedWorkload, handleClose]);

  // 행 클릭 핸들러
  const handleRowClick = useCallback((record: WorkloadItem) => {
    setSelectedWorkload(record.key);
  }, []);

  return (
    <Modal
      title="워크로드 정보 가져오기"
      open={isVisible}
      onCancel={handleClose}
      modalWidth={580}
      centered
      type="primary"
      icon={<Icon name="Copy" size={20} color="#FFF" />}
      okText="가져오기"
      cancelText="취소"
      onOk={handleImport}
      okButtonProps={{
        disabled: !selectedWorkload,
      }}
    >
      <ModalContent>
        <StyledTableWrapper>
          <Table
            columns={columns}
            dataSource={mockWorkloads}
            pagination={false}
            size="small"
            rowClassName={(record) =>
              selectedWorkload === record.key ? "selected-row" : ""
            }
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: {
                cursor: "pointer",
              },
            })}
          />
        </StyledTableWrapper>
      </ModalContent>
    </Modal>
  );
}

// 라디오 버튼 컴포넌트
const RadioButton = ({
  checked,
  onChange,
  id,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  name: string;
}) => (
  <RadioWrapper>
    <input
      type="radio"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className="sr-only"
      tabIndex={-1}
    />
    <RadioOuter
      checked={checked}
      role="radio"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
    >
      {checked && <RadioInner />}
    </RadioOuter>
  </RadioWrapper>
);

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`;

const StyledTableWrapper = styled.div`
  /* 선택된 행에 hover 스타일과 동일한 효과 적용 */
  .ant-table-tbody > tr.selected-row > td {
    background: var(--color-light-blue-10, #f2f7ff) !important;
    border-right: none !important;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 1px solid var(--color-blue-04, #3068e8);
      border-bottom: 1px solid var(--color-blue-04, #3068e8);
      pointer-events: none;
      z-index: 1;
    }

    &:first-child::before {
      border-left: 1px solid var(--color-blue-04, #3068e8);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child::before {
      border-right: 1px solid var(--color-blue-04, #3068e8);
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  /* 선택된 행에 hover 시에도 동일한 스타일 유지 */
  .ant-table-tbody > tr.selected-row:hover > td {
    background: var(--color-light-blue-10, #f2f7ff) !important;
  }
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RadioOuter = styled.div<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid ${({ checked }) => (checked ? "#544AD8" : "#D7D7D7")};
  background: ${({ checked }) => (checked ? "#544AD8" : "#FFFFFF")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:focus-visible {
    outline: 2px solid #544ad8;
    outline-offset: 2px;
  }
`;

const RadioInner = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
`;

const StatusLabel = styled.div<{ status: "Running" | "Waiting" | "Completed" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ status }) => {
    switch (status) {
      case "Running":
        return "#366BFF";
      case "Waiting":
        return "#00911D";
      case "Completed":
        return "#070913";
      default:
        return "#070913";
    }
  }};
`;

const StatusDot = styled.div<{ status: "Running" | "Waiting" | "Completed" }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ status }) => {
    switch (status) {
      case "Running":
        return "#2862FF";
      case "Waiting":
        return "#52BC4A";
      case "Completed":
        return "#7B7B7B";
      default:
        return "#7B7B7B";
    }
  }};
`;

