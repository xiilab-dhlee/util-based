// 내부 레지스트리 모델
export type PrivateRegistry = {
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
export type PrivateRegistryImage = {
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
// 내부 레지스트리 통계 모델
export type PrivateRegistryStatistics = {
  privateProjectCount: number;
  privateRepositoryCount: number;
  publicProjectCount: number;
  publicRepositoryCount: number;
  totalProjectCount: number;
  totalRepositoryCount: number;
  totalUsedStorage: string;
};
