import type { ResponsiveColumnType } from "xiilab-ui";

export const privateregistryListColumn: ResponsiveColumnType[] = [
  {
    title: "이미지 이름",
    dataIndex: "imageDisplayName",
    align: "left",
  },
  {
    title: "태그 수",
    dataIndex: "imageTagCount",
    width: 100,
    align: "center",
  },
  {
    title: "다운로드 수",
    dataIndex: "downloadCount",
    width: 100,
    align: "center",
  },
  {
    title: "생성자",
    dataIndex: "creatorName",
    width: 150,
    align: "center",
  },
  {
    title: "생성일",
    dataIndex: "createdAt",
    width: 150,
    align: "center",
  },
];
