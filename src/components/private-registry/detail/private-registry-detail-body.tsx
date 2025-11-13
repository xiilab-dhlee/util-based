"use client";

import { Icon, Table } from "xiilab-ui";

interface PrivateRegistryDetailBodyProps {
  /** 선택된 태그 수 변경 핸들러 */
  onSelectedTagsChange?: (count: number) => void;
}

/**
 * 내부 레지스트리 상세 페이지 본문 컴포넌트
 *
 * 태그 목록 테이블을 포함합니다.
 */
export function PrivateRegistryDetailBody({
  onSelectedTagsChange,
}: PrivateRegistryDetailBodyProps) {
  const columns = [
    {
      title: "태그",
      dataIndex: "tag",
      key: "tag",
      width: 80,
      render: (tag: string) => <span style={{ fontWeight: 500 }}>{tag}</span>,
    },
    {
      title: "이미지 크기",
      dataIndex: "imageSize",
      key: "imageSize",
      width: 100,
      render: (size: string) => (
        <span style={{ color: "#666", fontSize: "12px" }}>{size}</span>
      ),
    },
    {
      title: "보안 검사 진행 상태",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: "완료" | "검증중" | "검증실패") => {
        const statusConfig = {
          완료: { color: "#09DE5E", text: "완료" },
          검증중: { color: "#366BFF", text: "검증중" },
          검증실패: { color: "#FF3737", text: "검증실패" },
        };
        const config = statusConfig[status];
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: config.color,
                borderRadius: "50%",
              }}
            ></div>
            <span
              style={{
                color: config.color,
                fontWeight: 400,
                fontSize: "12px",
              }}
            >
              {config.text}
            </span>
          </div>
        );
      },
    },
    {
      title: "Critical",
      dataIndex: "critical",
      key: "critical",
      width: 80,
      align: "center" as const,
      render: (count: number) => (
        <span
          style={{
            color: "#333",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          {count > 0 ? `${count}개` : "-"}
        </span>
      ),
    },
    {
      title: "High",
      dataIndex: "high",
      key: "high",
      width: 70,
      align: "center" as const,
      render: (count: number) => (
        <span
          style={{
            color: "#333",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          {count > 0 ? `${count}개` : "-"}
        </span>
      ),
    },
    {
      title: "Medium",
      dataIndex: "medium",
      key: "medium",
      width: 80,
      align: "center" as const,
      render: (count: number) => (
        <span
          style={{
            color: "#333",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          {count > 0 ? `${count}개` : "-"}
        </span>
      ),
    },
    {
      title: "Low",
      dataIndex: "low",
      key: "low",
      width: 70,
      align: "center" as const,
      render: (count: number) => (
        <span
          style={{
            color: "#333",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          {count > 0 ? `${count}개` : "-"}
        </span>
      ),
    },
    {
      title: "생성자",
      dataIndex: "creator",
      key: "creator",
      width: 80,
      render: (creator: string) => (
        <span style={{ color: "#666", fontSize: "12px" }}>{creator}</span>
      ),
    },
    {
      title: "생성날짜",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (date: string) => (
        <span style={{ color: "#666", fontSize: "12px" }}>{date}</span>
      ),
    },
    {
      title: "최근 검증일시",
      dataIndex: "lastCheckedAt",
      key: "lastCheckedAt",
      width: 120,
      render: (date: string) => (
        <span style={{ color: "#666", fontSize: "12px" }}>{date}</span>
      ),
    },
    {
      title: "사용 가능 여부",
      dataIndex: "available",
      key: "available",
      width: 120,
      align: "center" as const,
      render: (available: boolean) => (
        <span
          style={{
            color: available ? "#09DE5E" : "#FF3737",
            fontWeight: 500,
            fontSize: "12px",
          }}
        >
          {available ? "가능" : "불가능"}
        </span>
      ),
    },
    {
      title: "상세",
      key: "detail",
      width: 60,
      align: "center" as const,
      render: () => (
        <div
          style={{
            width: "26px",
            height: "26px",
            border: "1px solid #DCDCDC",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "#FFFFFF",
            margin: "0 auto",
          }}
        >
          <Icon name="MoreHorizonal" size={16} />
        </div>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      tag: "v1.0.0",
      imageSize: "125.4 MB",
      critical: 2,
      high: 5,
      medium: 3,
      low: 1,
      status: "완료",
      createdAt: "2024.09.15",
      lastCheckedAt: "2024.09.15",
      creator: "홍길동",
      available: true,
    },
    {
      key: "2",
      tag: "v1.1.0",
      imageSize: "128.2 MB",
      critical: 0,
      high: 2,
      medium: 4,
      low: 2,
      status: "검증중",
      createdAt: "2024.09.16",
      lastCheckedAt: "2024.09.16",
      creator: "이영희",
      available: false,
    },
    {
      key: "3",
      tag: "v1.2.0",
      imageSize: "130.1 MB",
      critical: 1,
      high: 0,
      medium: 2,
      low: 5,
      status: "검증실패",
      createdAt: "2024.09.17",
      lastCheckedAt: "2024.09.17",
      creator: "김철수",
      available: false,
    },
    {
      key: "4",
      tag: "v2.0.0",
      imageSize: "142.7 MB",
      critical: 0,
      high: 1,
      medium: 1,
      low: 0,
      status: "완료",
      createdAt: "2024.09.18",
      lastCheckedAt: "2024.09.18",
      creator: "박민수",
      available: true,
    },
    {
      key: "5",
      tag: "v2.1.0",
      imageSize: "138.9 MB",
      critical: 3,
      high: 2,
      medium: 0,
      low: 1,
      status: "검증중",
      createdAt: "2024.09.19",
      lastCheckedAt: "2024.09.19",
      creator: "정수영",
      available: false,
    },
    {
      key: "6",
      tag: "latest",
      imageSize: "145.2 MB",
      critical: 0,
      high: 0,
      medium: 3,
      low: 2,
      status: "완료",
      createdAt: "2024.09.20",
      lastCheckedAt: "2024.09.20",
      creator: "홍길동",
      available: true,
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, overflow: "auto" }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys) => {
              console.log("선택된 행:", selectedRowKeys);
              onSelectedTagsChange?.(selectedRowKeys.length);
            },
          }}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}

