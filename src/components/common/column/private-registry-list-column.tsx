import type { ResponsiveColumnType } from "xiilab-ui";

export const privateRegistryListColumn: ResponsiveColumnType[] = [
  {
    title: "사용자 이름",
    dataIndex: "ownerName",
    align: "left",
  },
  {
    title: "컨테이너 이미지 개수",
    dataIndex: "imageCount",
    width: 150,
    align: "center",
  },
  {
    title: "스토리지 사용 용량",
    dataIndex: "storageUsage",
    align: "center",
  },
  {
    title: "생성 날짜",
    dataIndex: "creatorDate",
    align: "center",
  },
];

