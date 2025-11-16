import type { ResponsiveColumnType } from "xiilab-ui";
import { Tag } from "xiilab-ui";

import type { PrivateRegistryImage } from "@/types/private-registry/private-registry.model";

/**
 * 내부 레지스트리 이미지 상태에 따른 태그 렌더링
 */
const renderStatusTag = (status: "RUNNING" | "SUCCESSED") => {
  const statusConfig = {
    SUCCESSED: { color: "green", text: "완료" },
    RUNNING: { color: "blue", text: "진행중" },
  };

  const config = statusConfig[status] || { color: "gray", text: "알 수 없음" };

  return <Tag color={config.color}>{config.text}</Tag>;
};

/**
 * 내부 레지스트리 이미지 목록 테이블 컬럼 정의
 */
export const createPrivateRegistryListColumn = (
  onRowClick?: (record: PrivateRegistryImage) => void,
): ResponsiveColumnType[] => [
  {
    key: "name",
    title: "컨테이너 이미지 이름",
    dataIndex: "name",
    align: "left",
    width: 200,
    render: (name: string, record: PrivateRegistryImage) => (
      <span
        onClick={() => {
          if (onRowClick) {
            onRowClick(record);
          }
        }}
        style={{
          cursor: onRowClick ? "pointer" : "default",
        }}
      >
        {name}
      </span>
    ),
  },
  {
    key: "tagInfo",
    title: "최신 태그 / 개수",
    dataIndex: "tagCnt",
    align: "left",
    width: 150,
    render: (tagCnt: number) => (
      <span>v.1.2 / {tagCnt}개</span> // TODO: 실제 최신 태그 정보 연결
    ),
  },
  {
    key: "pullCount",
    title: "다운로드 횟수",
    dataIndex: "pullCnt",
    align: "center",
    width: 120,
    render: (pullCnt: number) => <span>{pullCnt}번</span>,
  },
  {
    key: "creator",
    title: "생성자",
    dataIndex: "projectId", // TODO: 실제 생성자 정보로 수정
    align: "center",
    width: 100,
    render: () => <span>홍길동</span>, // TODO: 실제 생성자 정보 연결
  },
  {
    key: "createDate",
    title: "생성일",
    dataIndex: "createTime",
    align: "center",
    width: 120,
    render: (createTime: string) => {
      const date = new Date(createTime);
      return (
        <span>
          {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, "0")}.
          {String(date.getDate()).padStart(2, "0")}
        </span>
      );
    },
  },
  {
    key: "description",
    title: "설명",
    dataIndex: "description",
    align: "left",
    width: 300,
    render: (description: string) => (
      <span style={{ color: description ? "#000" : "#BABABA" }}>
        {description || "컨테이너 이미지 설명 없음"}
      </span>
    ),
  },
  {
    key: "status",
    title: "업로드 상태",
    dataIndex: "status",
    align: "center",
    width: 100,
    render: (status: "RUNNING" | "SUCCESSED") => renderStatusTag(status),
  },
];

