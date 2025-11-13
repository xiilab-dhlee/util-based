// 내부 레지스트리 모델
export type Registry = {
  id: string;
  // 레지스트리명
  name: string;
  // 소유자 이름
  ownerName: string;
  // 이미지 개수
  imageCount: number;
  // 생성일
  creatorDate: string;
  // 사용량
  storageUsage: string;
};

// 내부 레지스트리 이미지 모델
export type RegistryImage = {
  id: number;
  projectId: number;
  name: string;
  description: string;
  tagCnt: number;
  pullCnt: number;
  createTime: string;
  updateTime: string;
  status: "RUNNING" | "SUCCESSED";
};

// 이미지 태그 모델
export type RegistryImageTag = {
  id: number;
  tag: string;
  imageSize: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  status: string;
  createdAt: string;
  lastCheckedAt: string;
  creator: string;
  available: boolean;
  requestReason: string;
  rejectReason: string;
};
